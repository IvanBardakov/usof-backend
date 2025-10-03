import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ quiet: true, override: true });

async function initDb() {
  // Combined flag
  const autoCreate = process.env.DB_AUTO_CREATE === "1";

  if (!autoCreate) {
    console.log("ℹ️ Skipping DB/user auto-creation, connecting directly...");
    return;
  }

  let rootConn;
  try {
    rootConn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_ADMIN_USER,
      password: process.env.DB_ADMIN_PASSWORD,
      multipleStatements: true,
    });

    // Create database if not exists
    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``,
    );
    console.log(`✅ Database ${process.env.DB_NAME} is ready`);

    // Create app user if not exists
    await rootConn.query(
      `CREATE USER IF NOT EXISTS '${process.env.DB_USER}'@'%' IDENTIFIED BY '${process.env.DB_PASSWORD}'`,
    );
    await rootConn.query(
      `GRANT ALL PRIVILEGES ON \`${process.env.DB_NAME}\`.* TO '${process.env.DB_USER}'@'%'`,
    );
    await rootConn.query("FLUSH PRIVILEGES");
    console.log(`✅ User ${process.env.DB_USER} is ready`);
  } catch (err) {
    console.error("❌ Error initializing DB:", err);
    throw err;
  } finally {
    if (rootConn) await rootConn.end();
  }
}

export default initDb;
