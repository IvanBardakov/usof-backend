// src/routes/users.js
import express from "express";
const router = express.Router();
import userController from "../controllers/UserController.js";
import sessionAuthMiddleware from "../middleware/sessionAuthMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { upload, multerErrorHandler } from "../middleware/multerAvatar.js";
import {
  userCreateValidation,
  userUpdateValidation,
} from "../validation/userValidation.js";
import {
  postCreateValidation,
  postUpdateValidation,
} from "../validation/postValidation.js";
import {
  categoryCreateValidation,
  categoryUpdateValidation,
} from "../validation/categoryValidation.js";
import { commentCreateValidation } from "../validation/commentValidation.js";
import { likeCreateValidation } from "../validation/likeValidation.js";
import validate from "../validation/validate.js";
import verifiedMiddleware from "../middleware/verifiedMiddleware.js";

// GET all users (admin only)
router.get("/", sessionAuthMiddleware, roleMiddleware("admin"), (req, res) =>
  userController.getAll(req, res),
);
// GET user by ID (admin or self)
router.get("/:user_id", sessionAuthMiddleware, (req, res) =>
  userController.getById(req, res),
);
// POST create user/admin (admin only)
router.post(
  "/",
  sessionAuthMiddleware,
  roleMiddleware("admin"),
  userCreateValidation,
  validate,
  (req, res, next) => userController.create(req, res, next),
);

// PATCH /api/users/avatar - upload user avatar (must be verified)
router.patch(
  "/avatar",
  sessionAuthMiddleware,
  verifiedMiddleware,
  upload.single("avatar"),
  multerErrorHandler,
  (req, res) => userController.uploadAvatar(req, res),
);

// PATCH update user (admin, must be verified)
router.patch(
  "/:user_id",
  sessionAuthMiddleware,
  roleMiddleware("admin"),
  userUpdateValidation,
  validate,
  (req, res) => {
    userController.update(req, res);
  },
);
// DELETE user (admin or self, must be verified)
router.delete("/:user_id", sessionAuthMiddleware, (req, res) =>
  userController.delete(req, res),
);

export default router;
