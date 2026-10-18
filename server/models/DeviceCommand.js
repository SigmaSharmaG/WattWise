import mongoose from "mongoose";

const deviceCommandSchema = new mongoose.Schema(
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
      enum: ["set_power", "set_mode"],
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "executing", "success", "failed"],
      default: "pending",
      index: true,
    },
    result: String,
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    acknowledgedAt: Date,
  },
  { timestamps: true }
);

deviceCommandSchema.index({ device: 1, status: 1, requestedAt: 1 });

export default mongoose.model("DeviceCommand", deviceCommandSchema);