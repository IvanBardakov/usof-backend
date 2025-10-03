// server.js
import dotenv from "dotenv";
dotenv.config({ quiet: true, override: true });

import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import initDb from "./src/db/init.js";
import setupDatabase from "./src/db/setup.js";

import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/users.js";
import postRoutes from "./src/routes/posts.js";
import categoryRoutes from "./src/routes/categories.js";
import commentRoutes from "./src/routes/comments.js";

import startAdmin from "./src/admin/admin.js";
import adminErrorHandler from "./src/admin/adminErrorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    await initDb();

    await setupDatabase();

    const app = express();

    const { adminRouter } = await startAdmin();
    app.use("/admin", adminRouter);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
      session({
        secret: process.env.COOKIE_SECRET || "usof_secret",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
      }),
    );

    app.use(
      "/uploads/avatars",
      express.static(path.join(__dirname, "uploads/avatars")),
    );
    app.use(
      "/uploads/posts",
      express.static(path.join(__dirname, "uploads/posts")),
    );

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/comments", commentRoutes);

    app.use("/admin", adminErrorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to initialize database:", err);
    process.exit(1);
  }
}

startServer();
