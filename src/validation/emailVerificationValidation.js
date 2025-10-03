// src/validation/emailVerificationValidation.js
import { body } from "express-validator";

const emailVerificationValidation = [body("token").optional().isString()];

export { emailVerificationValidation };
