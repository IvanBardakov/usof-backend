// src/routes/auth.js
import express from "express";
import { validationResult } from "express-validator";

import authController from "../controllers/AuthController.js";
import passwordResetController from "../controllers/PasswordResetController.js";
import emailVerificationController from "../controllers/EmailVerificationController.js";

import {
  registerValidation,
  loginValidation,
} from "../validation/authValidation.js";
import {
  passwordResetRequestValidation,
  passwordResetConfirmValidation,
} from "../validation/passwordResetValidation.js";
import { emailVerificationValidation } from "../validation/emailVerificationValidation.js";

import sessionAuthMiddleware from "../middleware/sessionAuthMiddleware.js";

const router = express.Router();

router.post("/register", registerValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  authController.register(req, res, next);
});

router.post("/login", loginValidation, (req, res) =>
  authController.login(req, res),
);

router.post("/logout", (req, res) => authController.logout(req, res));

router.post(
  "/email/send",
  sessionAuthMiddleware,
  emailVerificationController.sendVerification,
);

router.post(
  "/email/verify/:token",
  emailVerificationValidation,
  sessionAuthMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    await emailVerificationController.verify(req, res);
  },
);

router.post(
  "/password-reset",
  passwordResetRequestValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    passwordResetController.requestReset(req, res, next);
  },
);

router.post(
  "/password-reset/:confirm_token",
  passwordResetConfirmValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    passwordResetController.confirmReset(req, res, next);
  },
);

export default router;
