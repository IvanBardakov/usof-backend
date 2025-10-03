// src/models/Like.js
import BaseModel from "./BaseModel.js";
import pool from "../db/connection.js";
import Post from "./Post.js";

class Like extends BaseModel {
  constructor() {
    super("likes");
  }

  async create({ author_id, post_id, comment_id, type }) {
    if ((post_id && comment_id) || (!post_id && !comment_id)) {
      throw new Error(
        "Like must be for either a post or a comment, not both or neither",
      );
    }

    if (post_id) {
      const [postRows] = await pool.query("SELECT id FROM posts WHERE id = ?", [
        post_id,
      ]);
      if (postRows.length === 0) throw new Error("Post does not exist");

      const [result] = await pool.query(
        "INSERT INTO likes (author_id, post_id, type) VALUES (?, ?, ?)",
        [author_id, post_id, type],
      );

      await Post.recalculateLikeCount(post_id);
      return result.insertId;
    }

    if (comment_id) {
      const [commentRows] = await pool.query(
        "SELECT id FROM comments WHERE id = ?",
        [comment_id],
      );
      if (commentRows.length === 0) throw new Error("Comment does not exist");

      const [result] = await pool.query(
        "INSERT INTO likes (author_id, comment_id, type) VALUES (?, ?, ?)",
        [author_id, comment_id, type],
      );

      return result.insertId;
    }
  }

  async deleteByPostAndUser(post_id, author_id) {
    const [result] = await pool.query(
      "DELETE FROM likes WHERE post_id = ? AND author_id = ?",
      [post_id, author_id],
    );

    await Post.recalculateLikeCount(post_id);
    return result.affectedRows > 0;
  }

  async deleteByCommentAndUser(comment_id, author_id) {
    const [result] = await pool.query(
      "DELETE FROM likes WHERE comment_id = ? AND author_id = ?",
      [comment_id, author_id],
    );
    return result.affectedRows > 0;
  }

  async findByPostId(post_id) {
    const [rows] = await pool.query("SELECT * FROM likes WHERE post_id = ?", [
      post_id,
    ]);
    return rows;
  }

  async findByPostAndUser(post_id, author_id) {
    const [rows] = await pool.query(
      "SELECT * FROM likes WHERE post_id = ? AND author_id = ?",
      [post_id, author_id],
    );
    return rows[0] || null;
  }

  async findByCommentId(comment_id) {
    const [rows] = await pool.query(
      "SELECT * FROM likes WHERE comment_id = ?",
      [comment_id],
    );
    return rows;
  }

  async findByCommentAndUser(comment_id, author_id) {
    const [rows] = await pool.query(
      "SELECT * FROM likes WHERE comment_id = ? AND author_id = ?",
      [comment_id, author_id],
    );
    return rows[0] || null;
  }
}

export default new Like();
