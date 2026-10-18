import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  clearAuthCookies,
} from "../utils/tokens.js";

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  preferences: user.preferences,
  createdAt: user.createdAt,
});

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a name, valid email, and password (8–128 characters)",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: userResponse(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    console.error("Register error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password +refreshTokenHash");

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /auth/logout
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.sub)
          .select("+refreshTokenHash");

        if (
          user &&
          user.refreshTokenHash &&
          user.refreshTokenHash === hashToken(refreshToken)
        ) {
          user.refreshTokenHash = undefined;
          await user.save();
        }
      } catch {
        // Clear cookies even if the refresh token is invalid.
      }
    }

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error.message);

    clearAuthCookies(res);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /auth/me
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: userResponse(req.user),
  });
};

// PATCH /auth/me
export const updateMe = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim() ||
        name.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Name must contain 1–100 characters",
        });
      }

      updates.name = name.trim();
    }

    if (preferences !== undefined) {
      if (
        !preferences ||
        typeof preferences !== "object" ||
        Array.isArray(preferences)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid preferences",
        });
      }

      const allowedPreferences = [
        "theme",
        "mode",
        "notifications",
      ];

      const invalidKey = Object.keys(preferences).some(
        (key) => !allowedPreferences.includes(key)
      );

      if (invalidKey) {
        return res.status(400).json({
          success: false,
          message: "Unsupported preference field",
        });
      }

      const { theme, mode, notifications } = preferences;

      if (
        theme !== undefined &&
        !["light", "dark", "system"].includes(theme)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid theme",
        });
      }

      if (
        mode !== undefined &&
        !["saving", "balanced", "efficient"].includes(mode)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid energy mode",
        });
      }

      if (
        notifications !== undefined &&
        typeof notifications !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "Notifications must be true or false",
        });
      }

      if (theme !== undefined) {
        updates["preferences.theme"] = theme;
      }

      if (mode !== undefined) {
        updates["preferences.mode"] = mode;
      }

      if (notifications !== undefined) {
        updates["preferences.notifications"] = notifications;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile updates provided",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /auth/refresh
export const refresh = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.sub)
      .select("+refreshTokenHash");

    if (
      !user ||
      !user.refreshTokenHash ||
      user.refreshTokenHash !== hashToken(oldRefreshToken)
    ) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Rotate refresh token on every successful refresh.
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    clearAuthCookies(res);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};