// src/controllers/EmailVerificationController.js

import userModel from "../models/User.js";
import EmailVerificationTokenModel from "../models/EmailVerificationToken.js";
import transporter from "../config/mailConfig.js";
import crypto from "crypto";

class EmailVerificationController {
  async sendVerification(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      if (user.email_confirmed)
        return res.status(400).json({ error: "Email already verified" });
      const token = crypto.randomBytes(32).toString("hex");
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await EmailVerificationTokenModel.create({
        user_id: user.id,
        token,
        expires_at,
      });
      await transporter.sendMail({
        from: "usofsup@gmail.com",
        to: user.email,
        subject: "USOF Email Verification",
        text: `To verify your email, use this token: ${token}`,
      });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async verify(req, res) {
    try {
      const { token } = req.params;
      const tokenEntry = await EmailVerificationTokenModel.findByToken(token);
      if (
        !tokenEntry ||
        tokenEntry.used ||
        new Date(tokenEntry.expires_at) < new Date()
      ) {
        if (!updateSession)
          return res.status(400).json({ error: "Invalid or expired token" });
        return { error: "Invalid or expired token" };
      }
      await userModel.updateById(tokenEntry.user_id, { email_confirmed: true });
      await EmailVerificationTokenModel.markUsed(tokenEntry.id);
      req.session.user = { ...req.session.user, email_confirmed: true };
      return res.json({ success: true });
    } catch (err) {
      if (!updateSession) return res.status(500).json({ error: "Internal server error" });
      return { error: err.message, success: false };
    }
  }
}

export default new EmailVerificationController();
