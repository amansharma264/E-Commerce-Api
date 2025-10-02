// src/middlewares/verifyJWT.js
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new ApiError(401, "No token provided");

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) throw new ApiError(401, "Invalid token format");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // now req.user.id will be available
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid access Token"));
  }
};
