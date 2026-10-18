import crypto from "crypto";
import Device from "../models/Device.js";

export const protectIoTDevice = async (req, res, next) => {
  try {
    const token = req.headers["x-device-token"];

    if (!token || typeof token !== "string") {
      return res.status(401).json({
        success: false,
        message: "Missing device token",
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const device = await Device.findOne({
      hardwareTokenHash: tokenHash,
    }).select("+hardwareTokenHash");

    if (!device) {
      return res.status(401).json({
        success: false,
        message: "Invalid device token",
      });
    }

    req.iotDevice = device;
    next();
  } catch (error) {
    next(error);
  }
};