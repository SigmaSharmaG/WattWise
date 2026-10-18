import express from "express";

import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  refresh,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.post("/refresh", refresh);

export default router;