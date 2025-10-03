// src/controllers/PasswordResetController.js

import userModel from "../models/User.js";
import passwordResetTokenModel from "../models/PasswordResetToken.js";
import transporter from "../config/mailConfig.js";
import crypto from "crypto";
import { isStrongPassword } from "../utils/validationUtils.js";

class PasswordResetController {
  async requestReset(req, res) {
    try {
      const { email } = req.body;
      const user = await userModel.findByEmail(email);
      if (!user) return res.status(404).json({ error: "User not found" });
      const token = crypto.randomBytes(32).toString("hex");
      const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await passwordResetTokenModel.create({
        user_id: user.id,
        token,
        expires_at,
      });
      await transporter.sendMail({
        from: "usofsup@gmail.com",
        to: email,
        subject: "USOF Password Reset",
        text: `To reset your password, use this token: ${token}`,
      });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async confirmReset(req, res) {
    try {
      const { confirm_token } = req.params;
      const { new_password } = req.body;
      if (!isStrongPassword(new_password)) {
        return res.status(400).json({
          error:
            "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character",
        });
      }
      const tokenEntry =
        await passwordResetTokenModel.findByToken(confirm_token);
      if (
        !tokenEntry ||
        tokenEntry.used ||
        new Date(tokenEntry.expires_at) < new Date()
      ) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }
      await userModel.updateById(tokenEntry.user_id, {
        password: new_password,
      });
      await passwordResetTokenModel.markUsed(tokenEntry.id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new PasswordResetController();
