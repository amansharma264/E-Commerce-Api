import { Router } from "express";
import { createCheckoutSession, handleStripeWebhook } from "../controllers/payment.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

// Public route for Stripe webhook
router.post("/webhook", handleStripeWebhook);

// Protected route for creating a checkout session
router.post("/create-checkout-session", verifyJWT, createCheckoutSession);

export default router;