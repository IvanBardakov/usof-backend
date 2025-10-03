// src/controllers/UserController.js
import userModel from "../models/User.js";
import {
  isValidEmail,
  isValidLogin,
  isStrongPassword,
} from "../utils/validationUtils.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

class UserController {
  async getAll(req, res) {
    try {
      const users = await userModel.findAll();
      const safeUsers = users.map(({ password, ...rest }) => rest);
      res.json(safeUsers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const user = await userModel.findById(req.params.user_id);
      if (!user) return res.status(404).json({ error: "User not found" });
      const { password, email, email_confirmed, ...safeUser } = user;
      if (req.user && req.user.role === "admin") {
        const { password, ...adminUser } = user;
        return res.json(adminUser);
      }
      res.json(safeUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const { login, password, full_name, email, profile_picture, role } =
        req.body;
      if (!isValidEmail(email)) throw new Error("Invalid email format");
      if (!isValidLogin(login)) throw new Error("Invalid login format");
      if (!isStrongPassword(password)) throw new Error("Weak password");
      const userId = await userModel.create({
        login,
        password,
        full_name,
        email,
        profile_picture,
        role,
      });
      res.status(201).json({ userId });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await userModel.updateById(req.params.user_id, req.body);
      if (!updated)
        return res.status(404).json({ error: "User not found or not updated" });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const targetUserId = Number(req.params.user_id);

      if (req.user.role === "admin" && req.user.id !== targetUserId) {
        const deleted = await userModel.deleteById(targetUserId);
        if (!deleted)
          return res
            .status(404)
            .json({ error: "User not found or not deleted" });
        return res.json({ success: true });
      }

      if (req.user.id !== targetUserId) {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only delete your own account" });
      }

      const deleted = await userModel.deleteById(req.user.id);
      if (!deleted)
        return res.status(404).json({ error: "User not found or not deleted" });

      req.session.destroy((err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Account deleted but failed to clear session" });
        }
        res.clearCookie("connect.sid");
        res.json({
          success: true,
          message: "Account deleted and session ended",
        });
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async uploadAvatar(req, res) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      if (!req.user || !req.user.id || isNaN(Number(req.user.id))) {
        return res.status(400).json({
          error: "Authenticated user id missing or invalid",
          user: req.user,
        });
      }

      const userId = Number(req.user.id);
      const user = await userModel.findById(userId);

      if (user && user.profile_picture) {
        const oldAvatarPath = path.join(
          __dirname,
          "../../",
          user.profile_picture
        );

        if (
          fs.existsSync(oldAvatarPath) &&
          !user.profile_picture.endsWith("default.png") &&
          user.profile_picture !== `/uploads/avatars/${req.file.filename}`
        ) {
          fs.unlink(oldAvatarPath, (err) => {
            if (err) console.error("Failed to delete old avatar:", err);
          });
        }
      }

      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      const updated = await userModel.updateById(userId, {
        profile_picture: avatarPath,
      });
      if (!updated)
        return res.status(404).json({ error: "User not found or not updated" });

      res.json({ success: true, avatar: avatarPath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new UserController();
