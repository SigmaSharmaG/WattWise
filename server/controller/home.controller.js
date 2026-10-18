import mongoose from "mongoose";
import Home from "../models/Home.js";
import Room from "../models/Room.js";
import Device from "../models/Device.js";

const isValidId = (id) =>
  mongoose.isValidObjectId(id);

const validName = (name) =>
  typeof name === "string" &&
  name.trim().length > 0 &&
  name.trim().length <= 100;

// POST /homes
export const createHome = async (req, res) => {
  try {
    const {
      name,
      address = "",
      tariffPerKwh = 7.8,
      monthlyBudget = 3200,
      settings = {},
    } = req.body;

    if (!validName(name)) {
      return res.status(400).json({
        success: false,
        message: "A valid home name is required",
      });
    }

    if (
      typeof address !== "string" ||
      address.length > 300 ||
      typeof tariffPerKwh !== "number" ||
      !Number.isFinite(tariffPerKwh) ||
      tariffPerKwh < 0 ||
      typeof monthlyBudget !== "number" ||
      !Number.isFinite(monthlyBudget) ||
      monthlyBudget < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address, tariff, or budget",
      });
    }

    if (
      !settings ||
      typeof settings !== "object" ||
      Array.isArray(settings) ||
      Object.keys(settings).some(
        (key) => !["energyMode", "notifications"].includes(key)
      ) ||
      (settings.energyMode !== undefined &&
        !["saving", "balanced", "efficient"].includes(
          settings.energyMode
        )) ||
      (settings.notifications !== undefined &&
        typeof settings.notifications !== "boolean")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid home settings",
      });
    }

    const home = await Home.create({
      name: name.trim(),
      address: address.trim(),
      tariffPerKwh,
      monthlyBudget,
      settings,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Home created successfully",
      home,
    });
  } catch (error) {
    console.error("Create home:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /homes
export const getHomes = async (req, res) => {
  try {
    const homes = await Home.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: homes.length,
      homes,
    });
  } catch (error) {
    console.error("Get homes:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Shared helper: verify ownership of a home
const findOwnedHome = (homeId, userId) =>
  Home.findOne({
    _id: homeId,
    owner: userId,
  });

// GET /homes/:homeId
export const getHome = async (req, res) => {
  try {
    const { homeId } = req.params;

    if (!isValidId(homeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid home ID",
      });
    }

    const home = await findOwnedHome(homeId, req.user._id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    return res.status(200).json({
      success: true,
      home,
    });
  } catch (error) {
    console.error("Get home:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PATCH /homes/:homeId
export const updateHome = async (req, res) => {
  try {
    const { homeId } = req.params;

    if (!isValidId(homeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid home ID",
      });
    }

    const home = await findOwnedHome(homeId, req.user._id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    const { name, address, tariffPerKwh, monthlyBudget, settings } =
      req.body;

    if (
      name === undefined &&
      address === undefined &&
      tariffPerKwh === undefined &&
      monthlyBudget === undefined &&
      settings === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    if (name !== undefined) {
      if (!validName(name)) {
        return res.status(400).json({
          success: false,
          message: "Invalid home name",
        });
      }
      home.name = name.trim();
    }

    if (address !== undefined) {
      if (
        typeof address !== "string" ||
        address.length > 300
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid address",
        });
      }
      home.address = address.trim();
    }

    if (tariffPerKwh !== undefined) {
      if (
        typeof tariffPerKwh !== "number" ||
        !Number.isFinite(tariffPerKwh) ||
        tariffPerKwh < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Tariff must be a non-negative number",
        });
      }
      home.tariffPerKwh = tariffPerKwh;
    }

    if (monthlyBudget !== undefined) {
      if (
        typeof monthlyBudget !== "number" ||
        !Number.isFinite(monthlyBudget) ||
        monthlyBudget < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Budget must be a non-negative number",
        });
      }
      home.monthlyBudget = monthlyBudget;
    }

    if (settings !== undefined) {
      if (
        !settings ||
        typeof settings !== "object" ||
        Array.isArray(settings) ||
        Object.keys(settings).some(
          (key) => !["energyMode", "notifications"].includes(key)
        ) ||
        (settings.energyMode !== undefined &&
          !["saving", "balanced", "efficient"].includes(
            settings.energyMode
          )) ||
        (settings.notifications !== undefined &&
          typeof settings.notifications !== "boolean")
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid home settings",
        });
      }

      if (settings.energyMode !== undefined) {
        home.settings.energyMode = settings.energyMode;
      }

      if (settings.notifications !== undefined) {
        home.settings.notifications = settings.notifications;
      }
    }

    await home.save();

    return res.status(200).json({
      success: true,
      message: "Home updated successfully",
      home,
    });
  } catch (error) {
    console.error("Update home:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE /homes/:homeId
export const deleteHome = async (req, res) => {
  try {
    const { homeId } = req.params;

    if (!isValidId(homeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid home ID",
      });
    }

    const home = await findOwnedHome(homeId, req.user._id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    const rooms = await Room.find({
      home: home._id,
      owner: req.user._id,
    }).select("_id");

    const roomIds = rooms.map((room) => room._id);

    await Device.deleteMany({
      room: { $in: roomIds },
      owner: req.user._id,
    });

    await Room.deleteMany({
      home: home._id,
      owner: req.user._id,
    });

    await home.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Home and its rooms/devices deleted successfully",
    });
  } catch (error) {
    console.error("Delete home:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /homes/:homeId/summary
export const getHomeSummary = async (req, res) => {
  try {
    const { homeId } = req.params;

    if (!isValidId(homeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid home ID",
      });
    }

    const home = await findOwnedHome(homeId, req.user._id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    const rooms = await Room.find({
      home: home._id,
      owner: req.user._id,
    }).select("_id name type");

    const roomIds = rooms.map((room) => room._id);

    const devices = await Device.find({
      room: { $in: roomIds },
      owner: req.user._id,
    });

    const currentPowerW = devices.reduce(
      (sum, device) => sum + device.currentPowerW,
      0
    );

    const energyTodayKwh = devices.reduce(
      (sum, device) => sum + device.energyTodayKwh,
      0
    );

    const estimatedCostToday =
      energyTodayKwh * home.tariffPerKwh;

    return res.status(200).json({
      success: true,
      summary: {
        homeId: home._id,
        homeName: home.name,
        tariffPerKwh: home.tariffPerKwh,
        monthlyBudget: home.monthlyBudget,
        currentPowerW,
        energyTodayKwh,
        estimatedCostToday,
        roomCount: rooms.length,
        deviceCount: devices.length,
        onlineDeviceCount: devices.filter(
          (device) => device.isOnline
        ).length,
        rooms: rooms.map((room) => ({
          id: room._id,
          name: room.name,
          type: room.type,
          deviceCount: devices.filter(
            (device) => device.room.equals(room._id)
          ).length,
        })),
      },
    });
  } catch (error) {
    console.error("Home summary:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /homes/:homeId/rooms
export const getHomeRooms = async (req, res) => {
  try {
    const { homeId } = req.params;

    if (!isValidId(homeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid home ID",
      });
    }

    const home = await findOwnedHome(homeId, req.user._id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    const rooms = await Room.find({
      home: home._id,
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get home rooms:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /homes/:homeId/rooms
export const createRoom = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { name, type = "other", description = "" } = req.body;

    if (!isValidId(homeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid home ID",
      });
    }

    const home = await findOwnedHome(homeId, req.user._id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    const validTypes = [
      "living",
      "bedroom",
      "kitchen",
      "study",
      "bathroom",
      "outdoor",
      "other",
    ];

    if (
      !validName(name) ||
      !validTypes.includes(type) ||
      typeof description !== "string" ||
      description.length > 500
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid room name, type, or description",
      });
    }

    const room = await Room.create({
      name: name.trim(),
      type,
      description,
      home: home._id,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Shared helper: verify room ownership
const findOwnedRoom = (roomId, userId) =>
  Room.findOne({
    _id: roomId,
    owner: userId,
  });

// GET /rooms/:roomId
export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!isValidId(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    const room = await findOwnedRoom(roomId, req.user._id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get room:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PATCH /rooms/:roomId
export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name, type, description } = req.body;

    if (!isValidId(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    const room = await findOwnedRoom(roomId, req.user._id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (
      name === undefined &&
      type === undefined &&
      description === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    if (name !== undefined) {
      if (!validName(name)) {
        return res.status(400).json({
          success: false,
          message: "Invalid room name",
        });
      }
      room.name = name.trim();
    }

    if (type !== undefined) {
      const validTypes = [
        "living",
        "bedroom",
        "kitchen",
        "study",
        "bathroom",
        "outdoor",
        "other",
      ];

      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid room type",
        });
      }
      room.type = type;
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        description.length > 500
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid room description",
        });
      }
      room.description = description;
    }

    await room.save();

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    console.error("Update room:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE /rooms/:roomId
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!isValidId(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    const room = await findOwnedRoom(roomId, req.user._id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    await Device.deleteMany({
      room: room._id,
      owner: req.user._id,
    });

    await room.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Room and its devices deleted successfully",
    });
  } catch (error) {
    console.error("Delete room:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /rooms/:roomId/devices
export const getRoomDevices = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!isValidId(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    const room = await findOwnedRoom(roomId, req.user._id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const devices = await Device.find({
      room: room._id,
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      roomId: room._id,
      count: devices.length,
      devices,
    });
  } catch (error) {
    console.error("Get room devices:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};