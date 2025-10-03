import { body, validationResult } from "express-validator";

const MIN_LOGIN_LENGTH = 3;
const MAX_LOGIN_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 100;
const MIN_FULL_NAME_LENGTH = 1;
const MAX_FULL_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;

const registerValidation = [
  body("login")
    .isLength({ min: MIN_LOGIN_LENGTH, max: MAX_LOGIN_LENGTH })
    .withMessage(
      `Login must be ${MIN_LOGIN_LENGTH}-${MAX_LOGIN_LENGTH} characters, letters, numbers, or underscores`,
    )
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Login can only contain letters, numbers, and underscores"),

  body("password")
    .isLength({ max: MAX_PASSWORD_LENGTH })
    .withMessage(`Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`)
    .isStrongPassword({
      minLength: MIN_PASSWORD_LENGTH,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters and include uppercase, lowercase, a digit, and a special character`,
    ),

  body("password_confirmation")
    .exists()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

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
];

const loginValidation = [
  body("login")
    .isLength({ min: MIN_LOGIN_LENGTH, max: MAX_LOGIN_LENGTH })
    .withMessage(
      `Login must be ${MIN_LOGIN_LENGTH}-${MAX_LOGIN_LENGTH} characters, letters, numbers, or underscores`,
    )
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Login can only contain letters, numbers, and underscores"),

  body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH })
    .withMessage("Password length validation failed"),
];

export { loginValidation, registerValidation };
