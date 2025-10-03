import BaseModel from "./BaseModel.js";
import pool from "../db/connection.js";

class Comment extends BaseModel {
  constructor() {
    super("comments");
  }

  _mapCommentWithAuthor(rows) {
    if (!rows || rows.length === 0) return [];
    return rows.map((row) => {
      if (row.deleted) {
        return {
          id: row.id,
          post_id: row.post_id,
          parent_id: row.parent_id,
          deleted: true,
          content: "[deleted]",
          author: null,
          publish_date: row.publish_date,
        };
      }
      return {
        id: row.id,
        post_id: row.post_id,
        parent_id: row.parent_id,
        content: row.content,
        publish_date: row.publish_date,
        status: row.status,
        updated_at: row.updated_at,
        deleted: false,
        author: {
          id: row.author_id,
          login: row.author_login,
          profile_picture: row.profile_picture,
        },
      };
    });
  }

  async create({ post_id, author_id, content, parent_id = null }) {
    const [result] = await pool.query(
      `INSERT INTO comments (post_id, author_id, parent_id, content) VALUES (?, ?, ?, ?)`,
      [post_id, author_id, parent_id, content],
    );
    return result.insertId;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `
            SELECT 
                c.*, 
                u.login AS author_login, 
                u.profile_picture
            FROM comments c
            JOIN users u ON c.author_id = u.id
            WHERE c.id = ?
        `,
      [id],
    );

    const mapped = this._mapCommentWithAuthor(rows);
    return mapped.length > 0 ? mapped[0] : null;
  }

  async findByPostId(post_id) {
    const [rows] = await pool.query(
      `
            SELECT 
                c.*, 
                u.login AS author_login, 
                u.profile_picture
            FROM comments c
            JOIN users u ON c.author_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.publish_date ASC
        `,
      [post_id],
    );
    return this._mapCommentWithAuthor(rows);
  }

  async findReplies(parent_id) {
    const [rows] = await pool.query(
      `
            SELECT 
                c.*, 
                u.login AS author_login, 
                u.profile_picture
            FROM comments c
            JOIN users u ON c.author_id = u.id
            WHERE c.parent_id = ?
            ORDER BY c.publish_date ASC
        `,
      [parent_id],
    );
    return this._mapCommentWithAuthor(rows);
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
      `UPDATE comments SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
    return result.affectedRows > 0;
  }

  async softDeleteById(id) {
    const [result] = await pool.query(
      `UPDATE comments SET content = '[deleted]', deleted = 1 WHERE id = ?`,
      [id],
    );
    return result.affectedRows > 0;
  }
}

export default new Comment();
