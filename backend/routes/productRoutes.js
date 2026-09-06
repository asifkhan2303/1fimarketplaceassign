import express from "express";
import {
  getProducts,
  getProductById,
  getEmiPlans,
  getCategories,
} from "../controllers/productController.js";

const router = express.Router();

// Order matters: /categories must be registered before /:id
// otherwise Express treats "categories" as an :id param.
router.get("/categories", getCategories);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/emi-plans", getEmiPlans);

export default router;
