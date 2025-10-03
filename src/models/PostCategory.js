// src/models/PostCategory.js

import pool from "../db/connection.js";

class PostCategory {
  async add(post_id, category_id) {
    await pool.query(
      "INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)",
      [post_id, category_id],
    );
  }

  async removeAllForPost(post_id) {
    await pool.query("DELETE FROM post_categories WHERE post_id = ?", [
      post_id,
    ]);
  }

  async getCategoriesForPost(post_id) {
    const [rows] = await pool.query(
      "SELECT category_id FROM post_categories WHERE post_id = ?",
      [post_id],
    );
    return rows.map((row) => row.category_id);
  }

  async getPostsForCategory(category_id) {
    const [rows] = await pool.query(
      "SELECT post_id FROM post_categories WHERE category_id = ?",
      [category_id],
    );
    return rows.map((row) => row.post_id);
  }
}

export default new PostCategory();
