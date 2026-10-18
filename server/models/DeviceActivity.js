import mongoose from "mongoose";

const deviceActivitySchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "created",
        "updated",
        "deleted",
        "turned_on",
        "turned_off",
        "mode_changed",
        "command_requested",
        "command_executed",
        "command_failed",
        "telemetry_received",
      ],
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed", "info"],
      default: "info",
    },
  },
  { timestamps: true }
);

deviceActivitySchema.index({ device: 1, createdAt: -1 });

export default mongoose.model(
  "DeviceActivity",
  deviceActivitySchema
);