// src/admin/admin.js
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import Adapter, { Database, Resource } from "@adminjs/sql";
import pool from "../db/connection.js";
import bcrypt from "bcrypt";
import UserResource from "./resources/UserResource.js";
import PostResource from "./resources/PostResource.js";
import CategoryResource from "./resources/CategoryResource.js";
import CommentResource from "./resources/CommentResource.js";
import LikeResource from "./resources/LikeResource.js";
import FavoriteResource from "./resources/FavoriteResource.js";
import PostSubscriptionResource from "./resources/PostSubscriptionResource.js";
import PostCategoryResource from "./resources/PostCategoryResource.js";
import EmailVerificationTokenResource from "./resources/EmailVerificationTokenResource.js";
import PasswordResetTokenResource from "./resources/PasswordResetTokenResource.js";

AdminJS.registerAdapter({
  Database,
  Resource,
});

const authenticate = async (email, password) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, email, password, role FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return false;
    }
    const user = rows[0];
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return false;
    }
    if (user.role !== "admin") {
      return false;
    }
    const { password: _, ...safeUser } = user;
    return safeUser;
  } catch (err) {
    console.error("Authentication error:", err);
    return false;
  }
};

const startAdmin = async () => {
  const db = await new Adapter("mysql2", {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "usof_db",
  }).init();

  const adminJs = new AdminJS({
    resources: [
      // User Management
      { resource: db.table("users"), options: UserResource.options },
      // Content Management
      { resource: db.table("posts"), options: PostResource.options },
      { resource: db.table("comments"), options: CommentResource.options },
      { resource: db.table("categories"), options: CategoryResource.options },
      {
        resource: db.table("post_categories"),
        options: PostCategoryResource.options,
      },
      // User Activity
      { resource: db.table("likes"), options: LikeResource.options },
      { resource: db.table("favorites"), options: FavoriteResource.options },
      {
        resource: db.table("post_subscriptions"),
        options: PostSubscriptionResource.options,
      },
      // Administration & Debugging
      {
        resource: db.table("email_verification_tokens"),
        options: EmailVerificationTokenResource.options,
      },
      {
        resource: db.table("password_reset_tokens"),
        options: PasswordResetTokenResource.options,
      },
    ],
    rootPath: "/admin",
    branding: {
      companyName: "USOF Q&A",
    },
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: process.env.ADMIN_COOKIE_SECRET || "adminjs-super-secret",
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
    }
  );
  return { adminJs, adminRouter };
};

export default startAdmin;
