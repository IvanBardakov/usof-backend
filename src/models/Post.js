import BaseModel from "./BaseModel.js";
import pool from "../db/connection.js";

class Post extends BaseModel {
  constructor() {
    super("posts");
  }

  async create({ author_id, title, content, status = "active" }) {
    const [result] = await pool.query(
      `INSERT INTO posts (author_id, title, content, status) VALUES (?, ?, ?, ?)`,
      [author_id, title, content, status]
    );
    return result.insertId;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, u.login AS author_login, u.profile_picture AS author_profile_picture
             FROM posts p
             JOIN users u ON p.author_id = u.id
             WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  _buildOrderBy(sort, order) {
    const allowedSort = ["likes", "publish_date", "rating"];
    const allowedOrder = ["asc", "desc"];

    sort = allowedSort.includes(sort) ? sort : "likes";
    order = allowedOrder.includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "desc";

    if (sort === "likes") return "p.like_count DESC, p.publish_date DESC";
    if (sort === "publish_date")
      return `p.publish_date ${order === "asc" ? "ASC" : "DESC"}`;
  }

  _buildLimitOffset(limit, offset) {
    let sql = "";
    if (limit) sql += " LIMIT " + parseInt(limit, 10);
    if (offset) sql += " OFFSET " + parseInt(offset, 10);
    return sql;
  }

  async findAll({
    status,
    category,
    sort,
    order,
    limit,
    offset,
    date_from,
    date_to,
    author_id,
  }) {
    let query = `SELECT DISTINCT p.*, u.login AS author_login, u.profile_picture AS author_profile_picture
                     FROM posts p
                     JOIN users u ON p.author_id = u.id`;
    const params = [];
    const where = [];

    if (category) {
      query += " JOIN post_categories pc ON p.id = pc.post_id";
      where.push("pc.category_id = ?");
      params.push(category);
    }

    if (author_id) {
      where.push("p.author_id = ?");
      params.push(author_id);
    }

    if (status) {
      where.push("p.status = ?");
      params.push(status);
    }

    if (date_from) {
      where.push("p.publish_date >= ?");
      params.push(date_from);
    }

    if (date_to) {
      where.push("p.publish_date <= ?");
      params.push(date_to);
    }

    if (where.length) query += " WHERE " + where.join(" AND ");

    const orderBy = this._buildOrderBy(sort, order);
    const limitOffset = this._buildLimitOffset(limit, offset);

    const [rows] = await pool.query(
      `${query} ORDER BY ${orderBy} ${limitOffset}`,
      params
    );
    return rows;
  }

  async findAllWithUserVisibilityWithCount({
    userId,
    category,
    sort,
    order,
    limit,
    offset,
    date_from,
    date_to,
  }) {
    const params = [userId];
    let join = " JOIN users u ON p.author_id = u.id";
    let where = " WHERE (p.status = 'active' OR p.author_id = ?)";

    if (category) {
      join += " JOIN post_categories pc ON p.id = pc.post_id";
      where += " AND pc.category_id = ?";
      params.push(category);
    }

    if (date_from) {
      where += " AND p.publish_date >= ?";
      params.push(date_from);
    }
    if (date_to) {
      where += " AND p.publish_date <= ?";
      params.push(date_to);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(DISTINCT p.id) as total FROM posts p ${join} ${where}`,
      params
    );
    const total = countRows[0].total;

    const orderBy = this._buildOrderBy(sort, order);
    const limitOffset = this._buildLimitOffset(limit, offset);

    const [rows] = await pool.query(
      `SELECT DISTINCT p.*, u.login AS author_login, u.profile_picture AS author_profile_picture
             FROM posts p ${join} ${where}
             ORDER BY ${orderBy} ${limitOffset}`,
      params
    );

    return { posts: rows, count: total };
  }

  async findAllWithCount({
    status,
    category,
    sort,
    order,
    limit,
    offset,
    date_from,
    date_to,
    author_id,
  }) {
    const params = [];
    let join = " JOIN users u ON p.author_id = u.id";
    let where = " WHERE 1=1";

    if (category) {
      join += " JOIN post_categories pc ON p.id = pc.post_id";
      where += " AND pc.category_id = ?";
      params.push(category);
    }

    if (author_id) {
      where += " AND p.author_id = ?";
      params.push(author_id);
    }
    if (status) {
      where += " AND p.status = ?";
      params.push(status);
    }

    if (date_from) {
      where += " AND p.publish_date >= ?";
      params.push(date_from);
    }

    if (date_to) {
      where += " AND p.publish_date <= ?";
      params.push(date_to);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(DISTINCT p.id) as total FROM posts p ${join} ${where}`,
      params
    );
    const total = countRows[0].total;

    const orderBy = this._buildOrderBy(sort, order);
    const limitOffset = this._buildLimitOffset(limit, offset);

    const [rows] = await pool.query(
      `SELECT DISTINCT p.*, u.login AS author_login, u.profile_picture AS author_profile_picture
             FROM posts p ${join} ${where}
             ORDER BY ${orderBy} ${limitOffset}`,
      params
    );

    return { posts: rows, count: total };
  }

  async updateById(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      values.push(data[key]);
      fields.push(`${key} = ?`);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE posts SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async deleteById(id) {
    const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  async recalculateLikeCount(post_id) {
    const [rows] = await pool.query(
      `SELECT SUM(CASE WHEN type = 'like' THEN 1 WHEN type = 'dislike' THEN -1 ELSE 0 END) as total
             FROM likes WHERE post_id = ?`,
      [post_id]
    );
    const total = rows[0].total || 0;
    await pool.query("UPDATE posts SET like_count = ? WHERE id = ?", [
      total,
      post_id,
    ]);
    return total;
  }
}

export default new Post();
