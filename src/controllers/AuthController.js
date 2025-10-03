// src/controllers/AuthController.js

import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import {
  isValidEmail,
  isValidLogin,
  isStrongPassword,
} from "../utils/validationUtils.js";

class AuthController {
  async register(req, res) {
    try {
      let { login, password, password_confirmation, full_name, email } =
        req.body;
      if (password !== password_confirmation) {
        throw new Error("Password confirmation does not match password");
      }
      if (!isValidEmail(email)) {
        throw new Error("Invalid email format");
      }
      if (!isValidLogin(login)) {
        throw new Error(
          "Login must be 3-30 characters, letters, numbers, or underscores",
        );
      }
      if (!isStrongPassword(password)) {
        throw new Error(
          "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character",
        );
      }
      const existingUser = await userModel.findByLogin(login);
      if (existingUser) throw new Error("Login already exists");
      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) throw new Error("Email already exists");
      const profile_picture = "/uploads/avatars/default.png";
      const userId = await userModel.create({
        login,
        password,
        full_name,
        email,
        profile_picture,
      });
      res.status(201).json({ userId });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { login, password } = req.body;
      const user = await userModel.findByLogin(login);
      if (!user) throw new Error("Invalid login or password");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid login or password");
      req.session.user = {
        id: user.id,
        login: login,
        role: user.role,
        email_confirmed: user.email_confirmed,
      };
      res.json({
        success: true,
        user: {
          id: user.id,
          login: user.login,
          role: user.role,
          email_confirmed: user.email_confirmed,
        },
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async logout(req, res) {
    req.session.destroy(() => {
      res.json({ success: true, message: "Logged out. Session destroyed." });
    });
  }
}

export default new AuthController();
