import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper: Generate Access + Refresh Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );

  return { accessToken, refreshToken };
};

// REGISTER USER
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new ApiError(400, "All fields are required");

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already exists");

  const user = await User.create({ name, email, password });

  const { accessToken, refreshToken } = generateTokens(user._id);

  // Store refresh token in DB (optional, recommended)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {
          user: { id: user._id, name: user.name, email: user.email },
          accessToken,
          refreshToken,
        },
        "User registered successfully"
      )
    );
});

// LOGIN USER
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "All fields are required");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.json(
    new ApiResponse(
      200,
      {
        user: { id: user._id, name: user.name, email: user.email },
        accessToken,
        refreshToken,
      },
      "Login successful"
    )
  );
});

// REFRESH TOKEN
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(401, "Refresh token required");

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== refreshToken)
    throw new ApiError(401, "Invalid refresh token");

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.json(
    new ApiResponse(
      200,
      { accessToken, refreshToken: newRefreshToken },
      "Token refreshed"
    )
  );
});

// LOGOUT USER
const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");

  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  res.json(new ApiResponse(200, {}, "Logged out successfully"));
});

export { register, login, refreshAccessToken, logout };
