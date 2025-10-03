// middleware/postAccessMiddleware.js
import postModel from "../models/Post.js";

export default function postAccessMiddleware() {
  return async (req, res, next) => {
    try {
      const postId = req.params.post_id;
      const post = await postModel.findById(postId);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const sessionUser = req.session?.user || null;

      if (sessionUser?.role === "admin") {
        req.post = post;
        return next();
      }

      if (sessionUser?.id === post.author_id) {
        req.post = post;
        return next();
      }

      if (post.status !== "active") {
        return res.status(403).json({ error: "Forbidden: inactive post" });
      }

      req.post = post;
      next();
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
