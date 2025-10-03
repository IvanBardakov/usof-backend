// src/middleware/postUpdatePermissionMiddleware.js

import postModel from "../models/Post.js";

const postUpdatePermissionMiddleware = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.post_id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    req.post = post;
    if (req.user.role === "admin" && post.author_id !== req.user.id) {
      req.allowedPostUpdateFields = ["status"];
    } else if (post.author_id === req.user.id) {
      req.allowedPostUpdateFields = [
        "title",
        "content",
        "categories",
        "status",
      ];
    } else {
      return res
        .status(403)
        .json({ error: "Forbidden: can only update your own post" });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default postUpdatePermissionMiddleware;
