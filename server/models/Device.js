import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "light",
        "fan",
        "ac",
        "refrigerator",
        "computer",
        "sensor",
        "other",
      ],
      default: "other",
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    ratedPowerW: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Desired state requested by the user.
    isOn: {
      type: Boolean,
      default: false,
    },

    // Last state reported by the actual device.
    reportedIsOn: {
      type: Boolean,
      default: false,
    },

    currentPowerW: {
      type: Number,
      min: 0,
      default: 0,
    },

    energyTodayKwh: {
      type: Number,
      min: 0,
      default: 0,
    },

    voltageV: { type: Number, min: 0, default: 0 },
    currentMA: { type: Number, min: 0, default: 0 },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeenAt: {
      type: Date,
      default: null,
    },

    mode: {
      type: String,
      enum: ["saving", "balanced", "efficient"],
      default: "balanced",
    },

    controlCapabilities: {
      type: [String],
      default: ["on_off"],
      enum: ["on_off", "mode"],
    },
    hardwareId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    hardwareTokenHash: {
      type: String,
      select: false,
    },
    firmwareVersion: {
      type: String,
      default: "unknown",
    },
    lastSeenAt: Date,
  },
  { timestamps: true }
);

deviceSchema.index({ room: 1, owner: 1 });

export default mongoose.model("Device", deviceSchema);