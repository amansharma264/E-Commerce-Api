// src/middlewares/verifyJWT.js
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new ApiError(401, "No token provided");

    const token = authHeader.split(" ")[1];
    if (!token) throw new ApiError(401, "Invalid token format");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded._id || decoded.id).select("-password");
    if (!user) throw new ApiError(401, "User not found");

    req.user = user;  // ✅ Now req.user._id will always exist
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid access token"));
  }
};
