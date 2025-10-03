// src/controllers/PostImageController.js
import path from "path";

class PostImageController {
  async upload(req, res) {
    try {
      const { post_id } = req.body;
      if (!post_id) {
        return res.status(400).json({ error: "post_id is required" });
      }
      const fs = await import("fs");
      const path = await import("path");
      const uploadsDir = path.join(
        path.dirname(path.fileURLToPath(import.meta.url)),
        "../../uploads/posts"
      );
      const files = fs.readdirSync(uploadsDir);
      const postImages = files.filter((f) => f.startsWith(`${post_id}-`));
      if (postImages.length >= 10) {
        return res
          .status(400)
          .json({ error: "Maximum 10 images per post allowed" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const oldPath = path.join(uploadsDir, req.file.filename);
      const ext = path.extname(req.file.filename);
      const newName = `${post_id}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const newPath = path.join(uploadsDir, newName);
      fs.renameSync(oldPath, newPath);
      const url = `/uploads/posts/${newName}`;
      res.status(201).json({ url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new PostImageController();
