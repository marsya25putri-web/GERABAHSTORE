import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { upload, handleUploadError } from "../middleware/upload.js";
import { validateProduct } from "../utils/validation.js";

const router = express.Router();

// GET semua produk (dengan filter, search, pagination)
router.get("/", getProducts);

// GET single product
router.get("/:id", getProductById);

// POST create product (dengan upload gambar)
router.post(
  "/",
  upload.single("image"),
  handleUploadError,
  validateProduct,
  createProduct
);

// PUT update product
router.put(
  "/:id",
  upload.single("image"),
  handleUploadError,
  validateProduct,
  updateProduct
);

// DELETE product
router.delete("/:id", deleteProduct);

export default router;