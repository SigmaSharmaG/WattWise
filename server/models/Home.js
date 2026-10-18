import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    tariffPerKwh: {
      type: Number,
      default: 7.8,
      min: 0,
    },

    monthlyBudget: {
      type: Number,
      default: 3200,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },

    settings: {
      energyMode: {
        type: String,
        enum: ["saving", "balanced", "efficient"],
        default: "balanced",
      },

      notifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

const Home = mongoose.model("Home", homeSchema);

export default Home;