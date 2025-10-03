import { body, validationResult } from "express-validator";

const MIN_LOGIN_LENGTH = 3;
const MAX_LOGIN_LENGTH = 50;
const MAX_PASSWORD_LENGTH = 100;
const MAX_EMAIL_LENGTH = 100;
const MIN_FULL_NAME_LENGTH = 1;
const MAX_FULL_NAME_LENGTH = 100;

const userCreateValidation = [
  body("login")
    .isLength({ min: MIN_LOGIN_LENGTH, max: MAX_LOGIN_LENGTH })
    .withMessage(
      `Login must be between ${MIN_LOGIN_LENGTH} and ${MAX_LOGIN_LENGTH} characters long`,
    )
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Login can only contain letters, numbers, and underscores"),

  body("password")
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

  body("email")
    .isLength({ max: MAX_EMAIL_LENGTH })
    .withMessage(`Email cannot exceed ${MAX_EMAIL_LENGTH} characters`)
    .isEmail()
    .withMessage("Invalid email format"),

  body("full_name")
    .isLength({ min: MIN_FULL_NAME_LENGTH, max: MAX_FULL_NAME_LENGTH })
    .withMessage(
      `Full name is required and cannot exceed ${MAX_FULL_NAME_LENGTH} characters`,
    ),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage('Role must be "user" or "admin"'),
];

const userUpdateValidation = [
  body("login")
    .optional()
    .isLength({ min: MIN_LOGIN_LENGTH, max: MAX_LOGIN_LENGTH })
    .withMessage(
      `Login must be between ${MIN_LOGIN_LENGTH} and ${MAX_LOGIN_LENGTH} characters long`,
    )
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Login can only contain letters, numbers, and underscores"),

  body("password")
    .optional()
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

  body("email")
    .optional()
    .isLength({ max: MAX_EMAIL_LENGTH })
    .withMessage(`Email cannot exceed ${MAX_EMAIL_LENGTH} characters`)
    .isEmail()
    .withMessage("Invalid email format"),

  body("full_name")
    .optional()
    .isLength({ min: MIN_FULL_NAME_LENGTH, max: MAX_FULL_NAME_LENGTH })
    .withMessage(
      `Full name must be at least 1 character and cannot exceed ${MAX_FULL_NAME_LENGTH} characters`,
    ),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage('Role must be "user" or "admin"'),
];

export { userCreateValidation, userUpdateValidation };
