// src/models/User.js

import BaseModel from "./BaseModel.js";
import pool from "../db/connection.js";
import bcrypt from "bcrypt";

class User extends BaseModel {
  constructor() {
    super("users");
  }

  async create({
    login,
    password,
    full_name,
    email,
    profile_picture,
    role = "user",
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (login, password, full_name, email, profile_picture, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [login, hashedPassword, full_name, email, profile_picture, role],
    );
    return result.insertId;
  }

  async findByLogin(login) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE login = ?`, [
      login,
    ]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    return rows[0] || null;
  }

  async findAll() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async updateById(id, data) {
    if (!id || isNaN(Number(id))) {
      throw new Error("Invalid user id for updateById");
    }
    const fields = [];
    const values = [];
    for (const key in data) {
      if (key === "password") {
        values.push(await bcrypt.hash(data[key], 10));
        fields.push("password = ?");
      } else {
        values.push(data[key]);
        fields.push(`${key} = ?`);
      }
    }
    if (fields.length === 0) {
      throw new Error("No fields to update");
    }
    values.push(id);
    const [result] = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
    return result.affectedRows > 0;
  }

  async deleteById(id) {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  async getRating(userId) {
    const [postRows] = await pool.query(
      `SELECT 
                SUM(CASE WHEN l.type = 'like' THEN 1 WHEN l.type = 'dislike' THEN -1 ELSE 0 END) as post_rating
             FROM posts p
             LEFT JOIN likes l ON l.post_id = p.id
             WHERE p.author_id = ?`,
      [userId],
    );
    const [commentRows] = await pool.query(
      `SELECT 
                SUM(CASE WHEN l.type = 'like' THEN 1 WHEN l.type = 'dislike' THEN -1 ELSE 0 END) as comment_rating
             FROM comments c
             LEFT JOIN likes l ON l.comment_id = c.id
             WHERE c.author_id = ?`,
      [userId],
    );
    const postRating = Number(postRows[0].post_rating) || 0;
    const commentRating = Number(commentRows[0].comment_rating) || 0;
    return postRating + commentRating;
  }

  async recalculateAndUpdateRating(userId) {
    const [postRows] = await pool.query(
      `SELECT 
                SUM(CASE WHEN l.type = 'like' THEN 1 WHEN l.type = 'dislike' THEN -1 ELSE 0 END) as post_rating
             FROM posts p
             LEFT JOIN likes l ON l.post_id = p.id
             WHERE p.author_id = ?`,
      [userId],
    );
    const [commentRows] = await pool.query(
      `SELECT 
                SUM(CASE WHEN l.type = 'like' THEN 1 WHEN l.type = 'dislike' THEN -1 ELSE 0 END) as comment_rating
             FROM comments c
             LEFT JOIN likes l ON l.comment_id = c.id
             WHERE c.author_id = ?`,
      [userId],
    );
    const postRating = Number(postRows[0].post_rating) || 0;
    const commentRating = Number(commentRows[0].comment_rating) || 0;
    const totalRating = postRating + commentRating;
    await pool.query("UPDATE users SET rating = ? WHERE id = ?", [
      totalRating,
      userId,
    ]);
    return totalRating;
  }
}

export default new User();
