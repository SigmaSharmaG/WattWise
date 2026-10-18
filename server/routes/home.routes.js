import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  createHome,
  getHomes,
  getHome,
  updateHome,
  deleteHome,
  getHomeSummary,
  getHomeRooms,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  getRoomDevices,
} from "../controller/home.controller.js";

const router = express.Router();

// All endpoints require authentication.
router.use(protect);

// Home endpoints
router.post("/homes", createHome);
router.get("/homes", getHomes);
router.get("/homes/:homeId/summary", getHomeSummary);
router.get("/homes/:homeId/rooms", getHomeRooms);
router.post("/homes/:homeId/rooms", createRoom);
router.get("/homes/:homeId", getHome);
router.patch("/homes/:homeId", updateHome);
router.delete("/homes/:homeId", deleteHome);

// Room endpoints
router.get("/rooms/:roomId/devices", getRoomDevices);
router.get("/rooms/:roomId", getRoom);
router.patch("/rooms/:roomId", updateRoom);
router.delete("/rooms/:roomId", deleteRoom);

export default router;