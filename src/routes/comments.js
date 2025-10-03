// src/routes/comments.js
// Routes for comment-related endpoints

import express from "express";
const router = express.Router();
import commentController from "../controllers/CommentController.js";
import likeController from "../controllers/LikeController.js";
import sessionAuthMiddleware from "../middleware/sessionAuthMiddleware.js";
import { commentUpdateValidation } from "../validation/commentValidation.js";
import { likeCreateValidation } from "../validation/likeValidation.js";
import validate from "../validation/validate.js";
import verifiedMiddleware from "../middleware/verifiedMiddleware.js";

// GET specified comment data (public)
router.get("/:comment_id", (req, res) => commentController.getById(req, res));
// PATCH update specified comment data (author or admin & verified)
router.patch(
  "/:comment_id",
  sessionAuthMiddleware,
  verifiedMiddleware,
  commentUpdateValidation,
  validate,
  (req, res) => commentController.update(req, res),
);
// DELETE a comment (author or admin & verified)
router.delete(
  "/:comment_id",
  sessionAuthMiddleware,
  verifiedMiddleware,
  (req, res) => commentController.delete(req, res),
);
// GET all likes under the specified comment (public)
router.get("/:comment_id/like", (req, res) =>
  likeController.getByCommentId(req, res),
);
// POST create a like under a comment (auth required & verified)
router.post(
  "/:comment_id/like",
  sessionAuthMiddleware,
  verifiedMiddleware,
  likeCreateValidation,
  validate,
  (req, res) => likeController.createForComment(req, res),
);
// DELETE a like under a comment (auth required & verified)
router.delete(
  "/:comment_id/like",
  sessionAuthMiddleware,
  verifiedMiddleware,
  (req, res) => likeController.deleteForComment(req, res),
);
// POST Mark a comment as solution (only post author or admin)
router.post(
  "/:comment_id/solution",
  sessionAuthMiddleware,
  verifiedMiddleware,
  (req, res) => commentController.markAsSolution(req, res),
);
// DELETE Unmark a comment as solution
router.delete(
  "/:comment_id/solution",
  sessionAuthMiddleware,
  verifiedMiddleware,
  (req, res) => commentController.unmarkSolution(req, res),
);

export default router;
