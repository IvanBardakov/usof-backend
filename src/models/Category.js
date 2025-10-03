// src/models/Category.js

import BaseModel from "./BaseModel.js";
import pool from "../db/connection.js";

class Category extends BaseModel {
  constructor() {
    super("categories");
  }

  async create({ title, description }) {
    const [result] = await pool.query(
      `INSERT INTO categories (title, description) VALUES (?, ?)`,
      [title, description],
    );
    return result.insertId;
  }

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  async findAll() {
    const [rows] = await pool.query("SELECT * FROM categories");
    return rows;
  }

  async updateById(id, data) {
    const fields = [];
    const values = [];
    for (const key in data) {
      values.push(data[key]);
      fields.push(`${key} = ?`);
    }
    values.push(id);
    const [result] = await pool.query(
      `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
    return result.affectedRows > 0;
  }

  async deleteById(id) {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }

  async existsByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return false;
    const placeholders = ids.map(() => "?").join(",");
    const [rows] = await pool.query(
      `SELECT id FROM categories WHERE id IN (${placeholders})`,
      ids,
    );
    return rows.length === ids.length;
  }
}

export default new Category();
