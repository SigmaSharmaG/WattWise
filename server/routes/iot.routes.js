import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { protectIoTDevice } from "../middleware/iotAuth.middleware.js";

import {
  registerIoTDevice,
  receiveHeartbeat,
  getPendingCommands,
  acknowledgeCommand,
} from "../controller/iot.controller.js";

const router = express.Router();

// A logged-in user provisions a device they own.
router.post("/devices/register", protect, registerIoTDevice);

// The following endpoints require the ESP32's device token.
router.post("/devices/heartbeat", protectIoTDevice, receiveHeartbeat);

router.get(
  "/devices/:deviceId/commands/pending",
  protectIoTDevice,
  getPendingCommands
);

router.post(
  "/devices/:deviceId/commands/:commandId/ack",
  protectIoTDevice,
  acknowledgeCommand
);

export default router;