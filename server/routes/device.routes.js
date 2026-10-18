import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  listDevices,
  createDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  getDeviceStatus,
  sendDeviceCommand,
  getDeviceActivity,
  getLatestTelemetry,
  getTelemetryHistory,
} from "../controller/device.controller.js";

const router = express.Router();

router.use(protect);

// Device CRUD and listing
router.get("/devices", listDevices);
router.post("/devices", createDevice);
router.get("/devices/:deviceId/status", getDeviceStatus);
router.post("/devices/:deviceId/commands", sendDeviceCommand);
router.get("/devices/:deviceId/activity", getDeviceActivity);
router.get("/devices/:deviceId/telemetry/latest", getLatestTelemetry);
router.get("/devices/:deviceId/telemetry", getTelemetryHistory);
router.get("/devices/:deviceId", getDevice);
router.patch("/devices/:deviceId", updateDevice);
router.delete("/devices/:deviceId", deleteDevice);

export default router;