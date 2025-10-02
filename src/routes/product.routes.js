import { Router } from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    listProducts,
    getProducts
} from "../controllers/product.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public routes
router.route("/").get(listProducts);
router.route("/:id").get(getProducts);

// Admin-only routes
router.use(verifyJWT, requireAdmin);
router.route("/").post(createProduct);
router.route("/:id").put(updateProduct);
router.route("/:id").delete(deleteProduct);

export default router;