// src/routes/categories.js
import express from "express";
const router = express.Router();
import categoryController from "../controllers/CategoryController.js";
import sessionAuthMiddleware from "../middleware/sessionAuthMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  categoryCreateValidation,
  categoryUpdateValidation,
} from "../validation/categoryValidation.js";
import validate from "../validation/validate.js";

// GET all categories (public)
router.get("/", (req, res) => categoryController.getAll(req, res));
// GET category by ID (public)
router.get("/:category_id", (req, res) => categoryController.getById(req, res));
// GET all posts for a category (public)
router.get("/:category_id/posts", (req, res) =>
  categoryController.getPostsForCategory(req, res),
);
// POST create category (admin only)
router.post(
  "/",
  sessionAuthMiddleware,
  roleMiddleware("admin"),
  categoryCreateValidation,
  validate,
  (req, res) => categoryController.create(req, res),
);
// PATCH update category (admin only)
router.patch(
  "/:category_id",
  sessionAuthMiddleware,
  roleMiddleware("admin"),
  categoryUpdateValidation,
  validate,
  (req, res) => categoryController.update(req, res),
);
// DELETE category (admin only)
router.delete(
  "/:category_id",
  sessionAuthMiddleware,
  roleMiddleware("admin"),
  (req, res) => categoryController.delete(req, res),
);

export default router;
