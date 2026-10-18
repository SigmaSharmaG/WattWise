import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      default: "other",
    },

    currentPowerW: {
      type: Number,
      default: 0,
      min: 0,
    },

    energyTodayKwh: {
      type: Number,
      default: 0,
      min: 0,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    isOn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;