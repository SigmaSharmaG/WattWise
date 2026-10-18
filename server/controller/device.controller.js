import mongoose from "mongoose";
import Home from "../models/Home.js";
import Room from "../models/Room.js";
import Device from "../models/Device.js";
import Telemetry from "../models/Telemetry.js";
import DeviceActivity from "../models/DeviceActivity.js";
import DeviceCommand from "../models/DeviceCommand.js";

const validId = (id) => mongoose.isValidObjectId(id);

const validName = (name) =>
    typeof name === "string" &&
    name.trim().length > 0 &&
    name.trim().length <= 100;

const getOwnedDevice = (deviceId, owner) =>
    Device.findOne({ _id: deviceId, owner });

// Verify the room belongs to the authenticated user and home.
const getOwnedRoom = async (roomId, owner) => {
    const room = await Room.findOne({
        _id: roomId,
        owner,
    });

    if (!room) return null;

    const home = await Home.findOne({
        _id: room.home,
        owner,
    });

    return home ? room : null;
};

const logActivity = (device, action, details = {}, status = "info") =>
    DeviceActivity.create({
        device: device._id,
        owner: device.owner,
        action,
        details,
        status,
    });

// GET /devices?homeId=:homeId
export const listDevices = async (req, res) => {
    try {
        const { homeId } = req.query;

        if (!homeId || !validId(homeId)) {
            return res.status(400).json({
                success: false,
                message: "A valid homeId query parameter is required",
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
        }).populate("room", "name type");

        return res.json({
            success: true,
            count: devices.length,
            devices,
        });
    } catch (error) {
        console.error("List devices:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// POST /devices
export const createDevice = async (req, res) => {
    try {
        const {
            name,
            roomId,
            type = "other",
            description = "",
            ratedPowerW = 0,
            controlCapabilities = ["on_off"],
        } = req.body;

        const types = [
            "light", "fan", "ac", "refrigerator",
            "computer", "sensor", "other",
        ];

        const capabilities = ["on_off", "mode"];

        if (
            !validName(name) ||
            !roomId ||
            !validId(roomId) ||
            !types.includes(type) ||
            typeof description !== "string" ||
            description.length > 500 ||
            typeof ratedPowerW !== "number" ||
            !Number.isFinite(ratedPowerW) ||
            ratedPowerW < 0 ||
            !Array.isArray(controlCapabilities) ||
            controlCapabilities.some((c) => !capabilities.includes(c))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid device details",
            });
        }

        const room = await getOwnedRoom(roomId, req.user._id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        const device = await Device.create({
            name: name.trim(),
            room: room._id,
            owner: req.user._id,
            type,
            description,
            ratedPowerW,
            controlCapabilities,
        });

        await logActivity(device, "created", {
            name: device.name,
        });

        return res.status(201).json({
            success: true,
            message: "Device created successfully",
            device,
        });
    } catch (error) {
        console.error("Create device:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// GET /devices/:deviceId
export const getDevice = async (req, res) => {
    try {
        if (!validId(req.params.deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid device ID",
            });
        }

        const device = await getOwnedDevice(
            req.params.deviceId,
            req.user._id
        ).populate("room", "name type home");

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        return res.json({ success: true, device });
    } catch (error) {
        console.error("Get device:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// PATCH /devices/:deviceId
export const updateDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;

        if (!validId(deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid device ID",
            });
        }

        const device = await getOwnedDevice(deviceId, req.user._id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        const allowed = [
            "name",
            "type",
            "description",
            "ratedPowerW",
            "mode",
            "controlCapabilities",
        ];

        const keys = Object.keys(req.body);

        if (
            keys.length === 0 ||
            keys.some((key) => !allowed.includes(key))
        ) {
            return res.status(400).json({
                success: false,
                message: "No valid updates provided",
            });
        }

        const types = [
            "light", "fan", "ac", "refrigerator",
            "computer", "sensor", "other",
        ];

        if (
            req.body.name !== undefined &&
            !validName(req.body.name)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid device name",
            });
        }

        if (
            req.body.type !== undefined &&
            !types.includes(req.body.type)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid device type",
            });
        }

        if (
            req.body.description !== undefined &&
            (typeof req.body.description !== "string" ||
                req.body.description.length > 500)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid description",
            });
        }

        if (
            req.body.ratedPowerW !== undefined &&
            (typeof req.body.ratedPowerW !== "number" ||
                !Number.isFinite(req.body.ratedPowerW) ||
                req.body.ratedPowerW < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid rated power",
            });
        }

        if (
            req.body.mode !== undefined &&
            !["saving", "balanced", "efficient"].includes(
                req.body.mode
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid device mode",
            });
        }

        if (
            req.body.controlCapabilities !== undefined &&
            (!Array.isArray(req.body.controlCapabilities) ||
                req.body.controlCapabilities.some(
                    (c) => !["on_off", "mode"].includes(c)
                ))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid control capabilities",
            });
        }

        const before = {
            name: device.name,
            type: device.type,
            mode: device.mode,
        };

        for (const key of keys) {
            device[key] =
                key === "name" ? req.body[key].trim() : req.body[key];
        }

        await device.save();

        await logActivity(device, "updated", {
            before,
            fields: keys,
        });

        return res.json({
            success: true,
            message: "Device updated successfully",
            device,
        });
    } catch (error) {
        console.error("Update device:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// DELETE /devices/:deviceId
export const deleteDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;

        if (!validId(deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid device ID",
            });
        }

        const device = await getOwnedDevice(deviceId, req.user._id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        // Keep historical activity and telemetry records for audit/history.
        await device.deleteOne();

        return res.json({
            success: true,
            message: "Device removed successfully",
        });
    } catch (error) {
        console.error("Delete device:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// GET /devices/:deviceId/status
export const getDeviceStatus = async (req, res) => {
    try {
        if (!validId(req.params.deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid device ID",
            });
        }

        const device = await getOwnedDevice(
            req.params.deviceId,
            req.user._id
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        return res.json({
            success: true,
            status: {
                deviceId: device._id,
                isOnline: device.isOnline,
                requestedIsOn: device.isOn,
                reportedIsOn: device.reportedIsOn,
                currentPowerW: device.currentPowerW,
                energyTodayKwh: device.energyTodayKwh,
                mode: device.mode,
                lastSeenAt: device.lastSeenAt,
            },
        });
    } catch (error) {
        console.error("Device status:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// POST /devices/:deviceId/commands
export const sendDeviceCommand = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { action, value } = req.body;

        if (!validId(deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid device ID",
            });
        }

        const device = await getOwnedDevice(deviceId, req.user._id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        if (!device.isOnline) {
            return res.status(409).json({
                success: false,
                message: "Device is offline; command was not queued",
            });
        }

        if (action === "set_power") {
            if (
                typeof value !== "boolean" ||
                !device.controlCapabilities.includes("on_off")
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Unsupported power command",
                });
            }

            device.isOn = value;
            await device.save();

            await logActivity(
                device,
                "command_requested",
                { action, value },
                "pending"
            );

            return res.status(202).json({
                success: true,
                message: "Command request recorded; hardware confirmation pending",
                command: { action, value, status: "pending" },
            });
        }

        if (action === "set_mode") {
            if (
                !["saving", "balanced", "efficient"].includes(value) ||
                !device.controlCapabilities.includes("mode")
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Unsupported mode command",
                });
            }

            device.mode = value;
            await device.save();

            await logActivity(
                device,
                "command_requested",
                { action, value },
                "pending"
            );



            //   return res.status(202).json({
            //     success: true,
            //     message: "Mode request recorded; hardware confirmation pending",
            //     command: { action, value, status: "pending" },
            //   });
            const command = await DeviceCommand.create({
                device: device._id,
                owner: req.user._id,
                action,
                value,
                status: "pending",
            });

            return res.status(202).json({
                success: true,
                message: "Command queued for the ESP32",
                data: {
                    commandId: command._id,
                    action: command.action,
                    value: command.value,
                    status: command.status,
                },
            });
        }

        return res.status(400).json({
            success: false,
            message: "Supported actions: set_power, set_mode",
        });
    } catch (error) {
        console.error("Device command:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// GET /devices/:deviceId/activity
export const getDeviceActivity = async (req, res) => {
    try {
        const { deviceId } = req.params;

        if (!validId(deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid device ID",
            });
        }

        const device = await getOwnedDevice(deviceId, req.user._id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        const limit = Math.min(
            Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
            100
        );

        const activities = await DeviceActivity.find({
            device: device._id,
            owner: req.user._id,
        })
            .sort({ createdAt: -1 })
            .limit(limit);

        return res.json({
            success: true,
            count: activities.length,
            activities,
        });
    } catch (error) {
        console.error("Device activity:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// GET /devices/:deviceId/telemetry/latest
export const getLatestTelemetry = async (req, res) => {
    try {
        const { deviceId } = req.params;

        if (!validId(deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid device ID",
            });
        }

        const device = await getOwnedDevice(deviceId, req.user._id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        const reading = await Telemetry.findOne({
            device: device._id,
            owner: req.user._id,
        }).sort({ timestamp: -1 });

        return res.json({
            success: true,
            telemetry: reading,
        });
    } catch (error) {
        console.error("Latest telemetry:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// GET /devices/:deviceId/telemetry?limit=50
export const getTelemetryHistory = async (req, res) => {
    try {
        const { deviceId } = req.params;

        if (!validId(deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid device ID",
            });
        }

        const device = await getOwnedDevice(deviceId, req.user._id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        const parsedLimit = Number.parseInt(req.query.limit, 10);
        const limit = Math.min(
            Math.max(Number.isFinite(parsedLimit) ? parsedLimit : 50, 1),
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

            if (
                filter.timestamp.$gte &&
                filter.timestamp.$lte &&
                filter.timestamp.$gte > filter.timestamp.$lte
            ) {
                return res.status(400).json({
                    success: false,
                    message: "'from' must be earlier than 'to'",
                });
            }
        }

        const readings = await Telemetry.find(filter)
            .sort({ timestamp: -1 })
            .limit(limit);

        return res.json({
            success: true,
            count: readings.length,
            telemetry: readings,
        });
    } catch (error) {
        console.error("Telemetry history:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};