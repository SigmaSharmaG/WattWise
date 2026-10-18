import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export const generateAccessToken = (user) =>
  jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), jti: crypto.randomUUID() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
};

export const clearAuthCookies = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth",
  });
};