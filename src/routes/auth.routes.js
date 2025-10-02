import { Router } from "express";
import { register, login, refreshAccessToken, logout } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

// Protected Routes
router.post("/logout", verifyJWT, logout);

export default router;
