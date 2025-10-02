import { Router } from "express";
import { getCart, addToCart, removeFromCart, clearCart } from "../controllers/cart.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

// All cart routes are protected
router.use(verifyJWT);

router.get("/", getCart);           // Get cart
router.post("/add", addToCart);     // Add item
router.post("/remove", removeFromCart); // Remove item
router.delete("/clear", clearCart); // Clear cart

export default router;
