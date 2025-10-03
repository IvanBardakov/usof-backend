import pool from "../db/connection.js";

class PostSubscription {
  async subscribe(userId, postId) {
    try {
      const [result] = await pool.query(
        `INSERT INTO post_subscriptions (user_id, post_id) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP`,
        [userId, postId],
      );
      return result.insertId;
    } catch (err) {
      throw new Error("Failed to subscribe: " + err.message);
    }
  }

  async unsubscribe(userId, postId) {
    const [result] = await pool.query(
      `DELETE FROM post_subscriptions WHERE user_id = ? AND post_id = ?`,
      [userId, postId],
    );
    return result.affectedRows > 0;
  }

  async getByUser(userId) {
    const [rows] = await pool.query(
      `SELECT p.* FROM post_subscriptions ps
       JOIN posts p ON ps.post_id = p.id
       WHERE ps.user_id = ?`,
      [userId],
    );
    return rows;
  }

  async getSubscribers(postId) {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.login
       FROM post_subscriptions ps
       JOIN users u ON ps.user_id = u.id
       WHERE ps.post_id = ?`,
      [postId],
    );
    return rows;
  }

  async isSubscribed(userId, postId) {
    const [rows] = await pool.query(
      `SELECT 1 FROM post_subscriptions
       WHERE user_id = ? AND post_id = ?
       LIMIT 1`,
      [userId, postId],
    );
    return rows.length > 0;
  }
}

export default new PostSubscription();
