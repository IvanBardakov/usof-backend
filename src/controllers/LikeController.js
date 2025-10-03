// src/controllers/LikeController.js

import likeModel from "../models/Like.js";
import userModel from "../models/User.js";
import postModel from "../models/Post.js";
import commentModel from "../models/Comment.js";

class LikeController {
  async getByPostId(req, res) {
    try {
      const likes = await likeModel.findByPostId(req.params.post_id);
      res.json(likes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const { type } = req.body;
      if (!["like", "dislike"].includes(type))
        return res.status(400).json({ error: "Type must be like or dislike" });
      const author_id = req.user.id;
      const post_id = req.params.post_id;
      const post = await postModel.findById(post_id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      if (post.status !== "active")
        return res.status(400).json({ error: "Cannot like inactive post" });
      if (post.author_id === author_id) {
        return res
          .status(403)
          .json({ error: "You cannot like or dislike your own post" });
      }
      const existing = await likeModel.findByPostAndUser(post_id, author_id);
      if (existing && existing.type === type) {
        return res
          .status(200)
          .json({ message: `You have already ${type}d this post` });
      }
      if (existing) {
        await likeModel.deleteByPostAndUser(post_id, author_id);
      }
      const likeId = await likeModel.create({ author_id, post_id, type });
      if (post) await userModel.recalculateAndUpdateRating(post.author_id);
      res.status(201).json({ likeId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const author_id = req.user.id;
      const post_id = req.params.post_id;
      const post = await postModel.findById(post_id);
      const deleted = await likeModel.deleteByPostAndUser(post_id, author_id);
      if (post && deleted)
        await userModel.recalculateAndUpdateRating(post.author_id);
      if (!deleted)
        return res.status(404).json({ error: "Like not found or not deleted" });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getByCommentId(req, res) {
    try {
      const likes = await likeModel.findByCommentId(req.params.comment_id);
      res.json(likes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createForComment(req, res) {
    try {
      const { type } = req.body;
      if (!["like", "dislike"].includes(type))
        return res.status(400).json({ error: "Type must be like or dislike" });
      const author_id = req.user.id;
      const comment_id = req.params.comment_id;
      const comment = await commentModel.findById(comment_id);
      if (!comment) return res.status(404).json({ error: "Comment not found" });
      if (comment.status !== "active")
        return res.status(400).json({ error: "Cannot like inactive comment" });
      if (comment.author_id === author_id) {
        return res
          .status(403)
          .json({ error: "You cannot like or dislike your own comment" });
      }
      const existing = await likeModel.findByCommentAndUser(
        comment_id,
        author_id
      );
      if (existing && existing.type === type) {
        return res
          .status(200)
          .json({ message: `You have already ${type}d this comment` });
      }
      if (existing) {
        await likeModel.deleteByCommentAndUser(comment_id, author_id);
      }
      const likeId = await likeModel.create({ author_id, comment_id, type });
      if (comment)
        await userModel.recalculateAndUpdateRating(comment.author_id);
      res.status(201).json({ likeId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteForComment(req, res) {
    try {
      const author_id = req.user.id;
      const comment_id = req.params.comment_id;
      const comment = await commentModel.findById(comment_id);
      const deleted = await likeModel.deleteByCommentAndUser(
        comment_id,
        author_id
      );
      if (comment && deleted)
        await userModel.recalculateAndUpdateRating(comment.author_id);
      if (!deleted)
        return res.status(404).json({ error: "Like not found or not deleted" });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new LikeController();
