// src/controllers/CommentController.js

import commentModel from "../models/Comment.js";
import postModel from "../models/Post.js";
import notificationService from "../services/NotificationService.js";

class CommentController {
  async getByPostId(req, res) {
    try {
      const postId = req.params.post_id;

      const post = await postModel.findById(postId);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const isAdmin = req.session.user?.role === "admin";
      const userId = req.session.user?.id;

      if (!isAdmin && post.status !== "active") {
        return res
          .status(403)
          .json({ error: "Forbidden: cannot view comments of inactive post" });
      }

      const allComments = await commentModel.findByPostId(postId);

      const filteredComments = isAdmin
        ? allComments
        : allComments.filter(
            (comment) =>
              comment.status === "active" || comment.author_id === userId
          );

      res.json(filteredComments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const { content, parent_id = null } = req.body;
      if (!content)
        return res.status(400).json({ error: "Content is required" });

      const author_id = req.user.id;
      const post_id = req.params.post_id;

      const post = await postModel.findById(post_id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      if (post.status !== "active")
        return res
          .status(400)
          .json({ error: "Cannot comment under inactive post" });

      if (parent_id) {
        const parentComment = await commentModel.findById(parent_id);
        if (!parentComment) {
          return res.status(404).json({ error: "Parent comment not found" });
        }
        if (parentComment.post_id !== Number(post_id)) {
          return res
            .status(400)
            .json({ error: "Parent comment must belong to the same post" });
        }
        if (parentComment.status !== "active" || parentComment.deleted) {
          return res
            .status(400)
            .json({ error: "Cannot reply to inactive or deleted comment" });
        }
      }

      const commentId = await commentModel.create({
        post_id,
        author_id,
        content,
        parent_id,
      });

      notificationService
        .notifySubscribersNewComment({
          post,
          author: req.user,
          content,
        })
        .catch((err) => console.error("Notification error:", err));

      const newComment = await commentModel.findById(commentId);
      res.status(201).json(newComment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const comment = await commentModel.findById(req.params.comment_id);
      if (!comment) return res.status(404).json({ error: "Comment not found" });

      const post = await postModel.findById(comment.post_id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const isAdmin = req.session.user && req.session.user.role === "admin";
      const isCommentAuthor =
        req.session.user && comment.author_id === req.session.user.id;
      const isPostAuthor =
        req.session.user && post.author_id === req.session.user.id;

      if (!isAdmin) {
        if (post.status !== "active") {
          if (!isPostAuthor) {
            return res.status(403).json({
              error: "Forbidden: cannot view comments on inactive post",
            });
          }
          if (comment.status !== "active" && !isCommentAuthor) {
            return res.status(403).json({
              error: "Forbidden: cannot view inactive comment of another user",
            });
          }
        } else {
          if (comment.status !== "active" && !isCommentAuthor) {
            return res.status(403).json({
              error: "Forbidden: cannot view inactive comment of another user",
            });
          }
        }
      }

      res.json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getReplies(req, res) {
    try {
      const replies = await commentModel.findReplies(req.params.comment_id);
      res.json(replies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const comment = await commentModel.findById(req.params.comment_id);

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const { content, status } = req.body;
      const updateData = {};

      if (content !== undefined) {
        if (comment.author_id !== req.user.id) {
          return res
            .status(403)
            .json({ error: "You cannot edit someone else's comment." });
        }
        updateData.content = content;
      }

      if (status !== undefined) {
        if (req.user.role !== "admin") {
          return res
            .status(403)
            .json({ error: "Only admins can update comment status." });
        }
        updateData.status = status;
      }

      if (!Object.keys(updateData).length) {
        return res.status(400).json({ error: "No valid fields to update." });
      }

      const updated = await commentModel.updateById(
        req.params.comment_id,
        updateData
      );

      if (!updated) {
        return res.status(500).json({ error: "Failed to update comment." });
      }

      res.json({ success: true, updatedFields: updateData });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const comment = await commentModel.findById(req.params.comment_id);
      if (!comment) return res.status(404).json({ error: "Comment not found" });
      if (req.user.role !== "admin" && comment.author_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Forbidden: can only delete your own comment" });
      }

      const updated = await commentModel.updateById(req.params.comment_id, {
        deleted: 1,
        content: "[deleted]",
      });

      if (!updated)
        return res.status(400).json({ error: "Comment not deleted" });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async markAsSolution(req, res) {
    try {
      const { comment_id } = req.params;
      const comment = await commentModel.findById(comment_id);
      if (!comment) return res.status(404).json({ error: "Comment not found" });

      const post = await postModel.findById(comment.post_id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      if (req.user.role !== "admin" && post.author_id !== req.user.id) {
        return res.status(403).json({
          error: "Forbidden: only post author or admin can mark solution",
        });
      }

      const updated = await postModel.updateById(post.id, {
        solution_comment_id: comment.id,
      });
      if (!updated) return res.status(400).json({ error: "Solution not set" });

      res.json({ success: true, solution_comment_id: comment.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async unmarkSolution(req, res) {
    try {
      const { comment_id } = req.params;
      const comment = await commentModel.findById(comment_id);
      if (!comment) return res.status(404).json({ error: "Comment not found" });

      const post = await postModel.findById(comment.post_id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      if (req.user.role !== "admin" && post.author_id !== req.user.id) {
        return res.status(403).json({
          error: "Forbidden: only post author or admin can unmark solution",
        });
      }

      if (post.solution_comment_id !== comment.id) {
        return res
          .status(400)
          .json({ error: "This comment is not marked as solution" });
      }

      const updated = await postModel.updateById(post.id, {
        solution_comment_id: null,
      });
      if (!updated)
        return res.status(400).json({ error: "Solution not cleared" });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new CommentController();
