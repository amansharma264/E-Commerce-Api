import { Router } from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    listProducts,
    getProducts
} from "../controllers/product.controllers.js";

const router = Router();

// Public routes (no admin check)
router.route("/").get(listProducts);       // List all products
router.route("/:id").get(getProducts);     // Get product by ID
router.route("/").post(createProduct);     // Create product
router.route("/:id").put(updateProduct);   // Update product
router.route("/:id").delete(deleteProduct);// Delete product

export default router;
