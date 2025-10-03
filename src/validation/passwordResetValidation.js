import { body } from "express-validator";

const MAX_PASSWORD_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;

const passwordResetRequestValidation = [
  body("email")
    .isLength({ max: MAX_EMAIL_LENGTH })
    .withMessage(`Email cannot exceed ${MAX_EMAIL_LENGTH} characters`)
    .isEmail()
    .withMessage("Valid email is required"),
];

const passwordResetConfirmValidation = [
  body("new_password")
    .isLength({ max: MAX_PASSWORD_LENGTH })
    .withMessage(`Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`)
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, a digit, and a special character",
    ),
];

export { passwordResetRequestValidation, passwordResetConfirmValidation };
