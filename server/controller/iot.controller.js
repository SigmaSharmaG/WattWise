import crypto from "crypto";
import mongoose from "mongoose";
import Device from "../models/Device.js";
import DeviceCommand from "../models/DeviceCommand.js";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// POST /api/iot/devices/register
export const registerIoTDevice = async (req, res, next) => {
  try {
    const { deviceId, hardwareId, firmwareVersion } = req.body;

    if (
      !mongoose.isValidObjectId(deviceId) ||
      !hardwareId ||
      typeof hardwareId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "deviceId and hardwareId are required",
      });
    }

    const device = await Device.findOne({
      _id: deviceId,
      owner: req.user._id,
    }).select("+hardwareTokenHash");

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    const existingHardware = await Device.findOne({
      hardwareId,
      _id: { $ne: device._id },
    });

    if (existingHardware) {
      return res.status(409).json({
        success: false,
        message: "This hardware ID is already registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    device.hardwareId = hardwareId;
    device.hardwareTokenHash = hashToken(token);
    device.firmwareVersion = firmwareVersion || "unknown";
    device.isOnline = false;

    await device.save();

    return res.status(201).json({
      success: true,
      message: "ESP32 provisioned. Store this token securely.",
      data: {
        deviceId: device._id,
        hardwareId: device.hardwareId,
        deviceToken: token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/iot/devices/heartbeat
export const receiveHeartbeat = async (req, res, next) => {
  try {
    const device = req.iotDevice;
    const { firmwareVersion, health } = req.body;

    const update = {
      isOnline: true,
      lastSeenAt: new Date(),
    };

    if (firmwareVersion) update.firmwareVersion = firmwareVersion;

    await Device.updateOne(
      { _id: device._id },
      { $set: update }
    );

    return res.json({
      success: true,
      message: "Heartbeat received",
      data: {
        deviceId: device._id,
        isOnline: true,
        lastSeenAt: update.lastSeenAt,
        health: health ?? null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/iot/devices/:deviceId/commands/pending
export const getPendingCommands = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    if (String(req.iotDevice._id) !== deviceId) {
      return res.status(403).json({
        success: false,
        message: "This token cannot access another device",
      });
    }

    // Claim commands so concurrent polls don't repeatedly fetch them.
    const commands = [];

    for (let i = 0; i < 10; i++) {
      const command = await DeviceCommand.findOneAndUpdate(
        { device: req.iotDevice._id, status: "pending" },
        { $set: { status: "executing" } },
        { new: true, sort: { requestedAt: 1 } }
      );

      if (!command) break;
      commands.push(command);
    }

    return res.json({
      success: true,
      count: commands.length,
      data: commands.map((command) => ({
        commandId: command._id,
        action: command.action,
        value: command.value,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/iot/devices/:deviceId/commands/:commandId/ack
export const acknowledgeCommand = async (req, res, next) => {
  try {
    const { deviceId, commandId } = req.params;
    const { success, result } = req.body;

    if (
      String(req.iotDevice._id) !== deviceId ||
      !mongoose.isValidObjectId(commandId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid device or command ID",
      });
    }

    if (typeof success !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "success must be true or false",
      });
    }

    const command = await DeviceCommand.findOneAndUpdate(
      {
        _id: commandId,
        device: req.iotDevice._id,
        status: "executing",
      },
      {
        $set: {
          status: success ? "success" : "failed",
          result: typeof result === "string" ? result.slice(0, 500) : "",
          acknowledgedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!command) {
      return res.status(404).json({
        success: false,
        message: "Pending execution command not found",
      });
    }

    const deviceUpdate = {};

    if (success && command.action === "set_power") {
      deviceUpdate.reportedIsOn = command.value;
    }

    if (success && command.action === "set_mode") {
      deviceUpdate.mode = command.value;
    }

    if (Object.keys(deviceUpdate).length) {
      await Device.updateOne(
        { _id: req.iotDevice._id },
        { $set: deviceUpdate }
      );
    }

    return res.json({
      success: true,
      message: "Command acknowledgement recorded",
      data: command,
    });
  } catch (error) {
    next(error);
  }
};