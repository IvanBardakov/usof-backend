// src/models/Favorite.js
import pool from "../db/connection.js";

class PostFavorite {
  async add(user_id, post_id) {
    const [result] = await pool.query(
      "INSERT IGNORE INTO favorites (user_id, post_id) VALUES (?, ?)",
      [user_id, post_id],
    );
    return result.affectedRows > 0;
  }

  async remove(user_id, post_id) {
    const [result] = await pool.query(
      "DELETE FROM favorites WHERE user_id = ? AND post_id = ?",
      [user_id, post_id],
    );
    return result.affectedRows > 0;
  }

  async isFavorited(user_id, post_id) {
    const [rows] = await pool.query(
      "SELECT 1 FROM favorites WHERE user_id = ? AND post_id = ? LIMIT 1",
      [user_id, post_id],
    );
    return rows.length > 0;
  }

  async getUserFavorites(user_id) {
    const [rows] = await pool.query(
      "SELECT post_id FROM favorites WHERE user_id = ?",
      [user_id],
    );
    return rows.map((r) => r.post_id);
  }

  async getPostFavorites(post_id) {
    const [rows] = await pool.query(
      "SELECT user_id FROM favorites WHERE post_id = ?",
      [post_id],
    );
    return rows.map((r) => r.user_id);
  }
}

export default new PostFavorite();
