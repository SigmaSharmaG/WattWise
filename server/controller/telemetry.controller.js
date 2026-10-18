import mongoose from "mongoose";
import Telemetry from "../models/Telemetry.js";
import Device from "../models/Device.js";
import Room from "../models/Room.js";
import Home from "../models/Home.js";
// import { logDeviceActivity } from "./device.controller.js";

const validNumber = (value) =>
  value === undefined ||
  (typeof value === "number" && Number.isFinite(value) && value >= 0);

function validateReading(reading) {
  const fields = [
    "voltageV",
    "currentMA",
    "powerW",
    "energyKwh",
    "frequencyHz",
    "powerFactor",
  ];

  for (const field of fields) {
    if (!validNumber(reading[field])) return false;
  }

  if (
    reading.powerFactor !== undefined &&
    reading.powerFactor > 1
  ) {
    return false;
  }

  return true;
}

function normalizeReading(reading) {
  return {
    voltageV: reading.voltageV,
    currentMA: reading.currentMA,
    powerW: reading.powerW,
    energyKwh: reading.energyKwh,
    frequencyHz: reading.frequencyHz,
    powerFactor: reading.powerFactor,
    timestamp: reading.timestamp
      ? new Date(reading.timestamp)
      : new Date(),
  };
}

// POST /api/telemetry
export const receiveTelemetry = async (req, res, next) => {
  try {
    const device = req.iotDevice;
    const reading = req.body;

    if (!validateReading(reading)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sensor reading",
      });
    }

    const data = normalizeReading(reading);

    if (Number.isNaN(data.timestamp.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid timestamp",
      });
    }

    const telemetry = await Telemetry.create({
      device: device._id,
      owner: device.owner,
      ...data,
    });

    await Device.updateOne(
      { _id: device._id },
      {
        $set: {
          isOnline: true,
          lastSeenAt: new Date(),
          voltageV: data.voltageV,
          currentMA: data.currentMA,
          currentPowerW: data.powerW,
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Telemetry received",
      data: telemetry,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/telemetry/batch
export const receiveTelemetryBatch = async (req, res, next) => {
  try {
    const device = req.iotDevice;
    const { readings } = req.body;

    if (
      !Array.isArray(readings) ||
      readings.length === 0 ||
      readings.length > 500
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide between 1 and 500 readings",
      });
    }

    if (readings.some((reading) => !validateReading(reading))) {
      return res.status(400).json({
        success: false,
        message: "One or more readings are invalid",
      });
    }

    const documents = readings.map((reading) => ({
      device: device._id,
      owner: device.owner,
      ...normalizeReading(reading),
    }));

    if (
      documents.some((doc) => Number.isNaN(doc.timestamp.getTime()))
    ) {
      return res.status(400).json({
        success: false,
        message: "A reading contains an invalid timestamp",
      });
    }

    const saved = await Telemetry.insertMany(documents);

    // Use the newest reading to update the device's live status.
    const latest = documents.reduce((a, b) =>
      a.timestamp > b.timestamp ? a : b
    );

    await Device.updateOne(
      { _id: device._id },
      {
        $set: {
          isOnline: true,
          lastSeenAt: new Date(),
          voltageV: latest.voltageV,
          currentMA: latest.currentMA,
          currentPowerW: latest.powerW,
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Telemetry batch received",
      count: saved.length,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/telemetry/latest?homeId=...
export const getLatestHomeTelemetry = async (req, res, next) => {
  try {
    const { homeId } = req.query;

    if (!mongoose.isValidObjectId(homeId)) {
      return res.status(400).json({
        success: false,
        message: "A valid homeId is required",
      });
    }

    const home = await Home.findOne({
      _id: homeId,
      owner: req.user._id,
    });

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    const rooms = await Room.find({
      home: home._id,
      owner: req.user._id,
    }).select("_id");

    const devices = await Device.find({
      room: { $in: rooms.map((room) => room._id) },
      owner: req.user._id,
    }).select("_id name room");

    const readings = await Promise.all(
      devices.map(async (device) => {
        const latest = await Telemetry.findOne({
          device: device._id,
          owner: req.user._id,
        })
          .sort({ timestamp: -1 })
          .lean();

        return latest
          ? { device, reading: latest }
          : { device, reading: null };
      })
    );

    return res.json({
      success: true,
      count: readings.length,
      data: readings,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/devices/:deviceId/telemetry?limit=50&from=...&to=...
export const getDeviceTelemetryHistory = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    if (!mongoose.isValidObjectId(deviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid device ID",
      });
    }

    const device = await Device.findOne({
      _id: deviceId,
      owner: req.user._id,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 50, 1),
      500
    );

    const filter = {
      device: device._id,
      owner: req.user._id,
    };

    if (req.query.from || req.query.to) {
      filter.timestamp = {};

      if (req.query.from) {
        const from = new Date(req.query.from);
        if (Number.isNaN(from.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid from date",
          });
        }
        filter.timestamp.$gte = from;
      }

      if (req.query.to) {
        const to = new Date(req.query.to);
        if (Number.isNaN(to.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid to date",
          });
        }
        filter.timestamp.$lte = to;
      }
    }

    const data = await Telemetry.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};