// src/models/EmailVerificationToken.js

import BaseModel from "./BaseModel.js";
import pool from "../db/connection.js";

class EmailVerificationToken extends BaseModel {
  constructor() {
    super("email_verification_tokens");
  }

  async create({ user_id, token, expires_at }) {
    const [result] = await pool.query(
      `INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`,
      [user_id, token, expires_at],
    );
    return result.insertId;
  }

  async findByToken(token) {
    const [rows] = await pool.query(
      `SELECT * FROM email_verification_tokens WHERE token = ?`,
      [token],
    );
    return rows[0] || null;
  }

  async markUsed(id) {
    const [result] = await pool.query(
      `UPDATE email_verification_tokens SET used = TRUE WHERE id = ?`,
      [id],
    );
    return result.affectedRows > 0;
  }
}

export default new EmailVerificationToken();
