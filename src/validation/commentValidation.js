import { body, param, validationResult } from "express-validator";

const MIN_COMMENT_LENGTH = 1;
const MAX_COMMENT_LENGTH = 1000;
const allowedStatus = ["active", "inactive"];

const commentCreateValidation = [
  body("content")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: MIN_COMMENT_LENGTH, max: MAX_COMMENT_LENGTH })
    .withMessage(
      `Content is required and must be between ${MIN_COMMENT_LENGTH} and ${MAX_COMMENT_LENGTH} characters long`,
    ),

  param("post_id")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("post_id must be a positive integer"),
];

const commentUpdateValidation = [
  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: MIN_COMMENT_LENGTH, max: MAX_COMMENT_LENGTH })
    .withMessage(
      `Content must be between ${MIN_COMMENT_LENGTH} and ${MAX_COMMENT_LENGTH} characters long`,
    ),

  body("status")
    .optional()
    .isIn(allowedStatus)
    .withMessage('Status must be "active" or "inactive"'),
];

export { commentCreateValidation, commentUpdateValidation };
