// src/db/setup.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pool from "./connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeAndSplitSql(sql) {
  sql = sql.replace(/^\uFEFF/, "");

  sql = sql.replace(/\/\*[\s\S]*?\*\//g, "\n");

  sql = sql.replace(/(^|\n)\s*--[^\n]*(\n|$)/g, "\n");
  sql = sql.replace(/(^|\n)\s*#[^\n]*(\n|$)/g, "\n");

  sql = sql.replace(/\r\n/g, "\n");

  return sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function setupDatabase() {
  const schemaPath = path.join(__dirname, "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.warn("schema.sql not found at", schemaPath);
    return;
  }

  const raw = fs.readFileSync(schemaPath, "utf8");
  const statements = normalizeAndSplitSql(raw);
  if (statements.length === 0) {
    console.log("No statements found in schema.sql");
    return;
  }

  const connection = await pool.getConnection();
  try {
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (!stmt) continue;
      try {
        await connection.query(stmt);
      } catch (stmtErr) {
        const snippet = stmt.length > 200 ? stmt.slice(0, 200) + "..." : stmt;
        stmtErr.message = `Error executing statement #${i + 1}: ${stmtErr.message}\nStatement snippet: ${snippet}`;
        throw stmtErr;
      }
    }

    try {
      await connection.query(`
        ALTER TABLE posts
          ADD CONSTRAINT fk_posts_solution_comment
          FOREIGN KEY (solution_comment_id) REFERENCES comments(id)
          ON DELETE SET NULL
      `);
    } catch (err) {
      if (err.code === "ER_FK_DUP_NAME") {
      } else {
        throw err;
      }
    }

    console.log(`✅ Schema initialized`);
  } finally {
    connection.release();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Setup DB error:", err);
      process.exit(1);
    });
}

export default setupDatabase;
