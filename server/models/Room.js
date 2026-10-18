import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    home: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
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
        "living",
        "bedroom",
        "kitchen",
        "study",
        "bathroom",
        "outdoor",
        "other",
      ],
      default: "other",
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

roomSchema.index({ home: 1, name: 1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;