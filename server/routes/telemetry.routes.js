import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { protectIoTDevice } from "../middleware/iotAuth.middleware.js";

import {
  receiveTelemetry,
  receiveTelemetryBatch,
  getLatestHomeTelemetry,
  getDeviceTelemetryHistory,
} from "../controller/telemetry.controller.js";

const router = express.Router();

// ESP32-authenticated endpoints
router.post("/", protectIoTDevice, receiveTelemetry);
router.post("/batch", protectIoTDevice, receiveTelemetryBatch);

// User-authenticated dashboard endpoints
router.get("/latest", protect, getLatestHomeTelemetry);
router.get(
  "/devices/:deviceId/telemetry",
  protect,
  getDeviceTelemetryHistory
);

export default router;