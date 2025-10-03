// src/models/BaseModel.js

import pool from "../db/connection.js";

class BaseModel {
  constructor(tableName) {
    this.table = tableName;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM \`${this.table}\` WHERE id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  async findAll() {
    const [rows] = await pool.query(`SELECT * FROM \`${this.table}\``);
    return rows;
  }

  async deleteById(id) {
    const [result] = await pool.query(
      `DELETE FROM \`${this.table}\` WHERE id = ?`,
      [id],
    );
    return result.affectedRows > 0;
  }
}

export default BaseModel;
