// src/routes/posts.js
import express from "express";
const router = express.Router();

import postController from "../controllers/PostController.js";
import commentController from "../controllers/CommentController.js";
import likeController from "../controllers/LikeController.js";
import postSubscriptionController from "../controllers/PostSubscriptionController.js";
import postFavoriteController from "../controllers/PostFavoriteController.js";
import postImageController from "../controllers/PostImageController.js";

import sessionAuthMiddleware from "../middleware/sessionAuthMiddleware.js";
import verifiedMiddleware from "../middleware/verifiedMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import postUpdatePermissionMiddleware from "../middleware/postUpdatePermissionMiddleware.js";
import uploadPostImage from "../middleware/multerPostImage.js";
import postAccessMiddleware from "../middleware/postAccessMiddleware.js";

import {
  postCreateValidation,
  postUpdateValidation,
  postQueryValidation,
  postIdValidation,
} from "../validation/postValidation.js";
import { commentCreateValidation } from "../validation/commentValidation.js";
import { likeCreateValidation } from "../validation/likeValidation.js";
import validate from "../validation/validate.js";

// GET all posts (public, with filtering/sorting/pagination)
router.get("/", postQueryValidation, validate, (req, res) =>
  postController.getAll(req, res),
);

// GET all posts the current user is subscribed to
router.get("/subscriptions", sessionAuthMiddleware, (req, res) =>
  postSubscriptionController.listSubscriptions(req, res),
);

// Get all favorite post ids for the user
router.get(
  "/favorites",
  sessionAuthMiddleware,
  verifiedMiddleware,
  (req, res) => postFavoriteController.getUserFavorites(req, res),
);

// GET post by ID (with access check, inactive posts blocked for non-author/non-admin)
router.get(
  "/:post_id",
  postIdValidation,
  validate,
  postAccessMiddleware(),
  (req, res) => postController.getById(req, res),
);

// POST create post (auth & verified)
router.post(
  "/",
  sessionAuthMiddleware,
  verifiedMiddleware,
  postCreateValidation,
  validate,
  (req, res) => postController.create(req, res),
);

// PATCH update post (author/admin & verified)
router.patch(
  "/:post_id",
  postIdValidation,
  sessionAuthMiddleware,
  verifiedMiddleware,
  postUpdatePermissionMiddleware,
  postUpdateValidation,
  validate,
  (req, res) => postController.update(req, res),
);

// DELETE post (author/admin & verified)
router.delete(
  "/:post_id",
  postIdValidation,
  sessionAuthMiddleware,
  verifiedMiddleware,
  postAccessMiddleware(),
  (req, res) => postController.delete(req, res),
);

// Add a post to favorites
router.post(
  "/:post_id/favorite",
  postIdValidation,
  sessionAuthMiddleware,
  verifiedMiddleware,
  postAccessMiddleware(),
  (req, res) => postFavoriteController.add(req, res),
);

// Remove a post from favorites
router.delete(
  "/:post_id/favorite",
  postIdValidation,
  sessionAuthMiddleware,
  verifiedMiddleware,
  postAccessMiddleware(),
  (req, res) => postFavoriteController.remove(req, res),
);

// Subscribe to a post
router.post(
  "/:post_id/subscribe",
  postIdValidation,
  sessionAuthMiddleware,
  verifiedMiddleware,
  postAccessMiddleware(),
  (req, res) => postSubscriptionController.subscribe(req, res),
);

// Unsubscribe from a post
router.delete(
  "/:post_id/subscribe",
  postIdValidation,
  sessionAuthMiddleware,
  verifiedMiddleware,
  postAccessMiddleware(),
  (req, res) => postSubscriptionController.unsubscribe(req, res),
);

// GET all comments for a post
router.get(
  "/:post_id/comments",
  postIdValidation,
  validate,
  postAccessMiddleware(),
  (req, res) => commentController.getByPostId(req, res),
);

// POST create comment for a post (auth & verified)
router.post(
  "/:post_id/comments",
  postIdValidation,
  sessionAuthMiddleware,
  verifiedMiddleware,
  postAccessMiddleware(),
  commentCreateValidation,
  validate,
  (req, res) => commentController.create(req, res),
);

// GET all categories for a post
router.get(
  "/:post_id/categories",
  postIdValidation,
  validate,
  postAccessMiddleware(),
  (req, res) => postController.getCategories(req, res),
);

// GET all likes for a post
router.get(
  "/:post_id/like",
  postIdValidation,
  validate,
  postAccessMiddleware(),
  (req, res) => likeController.getByPostId(req, res),
);

// POST like/dislike a post (auth & verified)
router.post(
  "/:post_id/like",
  postIdValidation,
  sessionAuthMiddleware,
  verifiedMiddleware,
  postAccessMiddleware(),
  likeCreateValidation,
  validate,
  (req, res) => likeController.create(req, res),
);

// DELETE like for a post (auth & verified)
router.delete(
  "/:post_id/like",
  postIdValidation,
  sessionAuthMiddleware,
  verifiedMiddleware,
  postAccessMiddleware(),
  (req, res) => likeController.delete(req, res),
);

// POST upload a post image (auth & verified)
router.post(
  "/images",
  sessionAuthMiddleware,
  verifiedMiddleware,
  uploadPostImage.single("image"),
  (req, res) => postImageController.upload(req, res),
);

export default router;
