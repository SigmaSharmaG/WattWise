import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema(
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

    voltageV: { type: Number, min: 0 },
    currentMA: { type: Number, min: 0 },
    powerW: { type: Number, min: 0 },
    energyKwh: { type: Number, min: 0 },
    frequencyHz: { type: Number, min: 0 },
    powerFactor: { type: Number, min: 0, max: 1 },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

telemetrySchema.index({ device: 1, timestamp: -1 });

export default mongoose.model("Telemetry", telemetrySchema);