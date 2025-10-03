// src/models/PasswordResetToken.js

import BaseModel from "./BaseModel.js";
import pool from "../db/connection.js";

class PasswordResetToken extends BaseModel {
  constructor() {
    super("password_reset_tokens");
  }

  async create({ user_id, token, expires_at }) {
    const [result] = await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`,
      [user_id, token, expires_at],
    );
    return result.insertId;
  }

  async findByToken(token) {
    const [rows] = await pool.query(
      `SELECT * FROM password_reset_tokens WHERE token = ?`,
      [token],
    );
    return rows[0] || null;
  }

  async markUsed(id) {
    const [result] = await pool.query(
      `UPDATE password_reset_tokens SET used = TRUE WHERE id = ?`,
      [id],
    );
    return result.affectedRows > 0;
  }
}

export default new PasswordResetToken();
