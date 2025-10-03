// src/middleware/postValidation.js
import { body, query, param } from "express-validator";

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 255;
const MIN_CONTENT_LENGTH = 1;
const MAX_CONTENT_LENGTH = 65000;
const MIN_CATEGORIES = 1;
const MAX_CATEGORIES = 10;
const MAX_QUERY_LIMIT = 100;
const allowedStatus = ["active", "inactive"];
const allowedSort = ["likes", "date", "rating", "publish_date"];
const allowedOrder = ["asc", "desc"];

const postCreateValidation = [
  body("title")
    .isLength({ min: MIN_TITLE_LENGTH, max: MAX_TITLE_LENGTH })
    .withMessage(
      `Title is required and must be 1-${MAX_TITLE_LENGTH} characters long`,
    ),
  body("content")
    .isLength({ min: MIN_CONTENT_LENGTH, max: MAX_CONTENT_LENGTH })
    .withMessage(
      `Content is required and cannot exceed ${MAX_CONTENT_LENGTH} characters`,
    ),
  body("categories")
    .isArray({ min: MIN_CATEGORIES, max: MAX_CATEGORIES })
    .withMessage(
      `At least ${MIN_CATEGORIES} category is required, and a maximum of ${MAX_CATEGORIES} are allowed`,
    ),
];

const postUpdateValidation = [
  body("title")
    .optional()
    .isLength({ min: MIN_TITLE_LENGTH, max: MAX_TITLE_LENGTH })
    .withMessage(`Title must be 1-${MAX_TITLE_LENGTH} characters long`),
  body("content")
    .optional()
    .isLength({ min: MIN_CONTENT_LENGTH, max: MAX_CONTENT_LENGTH })
    .withMessage(
      `Content cannot be empty and cannot exceed ${MAX_CONTENT_LENGTH} characters`,
    ),
  body("categories")
    .optional()
    .isArray({ min: MIN_CATEGORIES, max: MAX_CATEGORIES })
    .withMessage(
      `Categories must contain at least ${MIN_CATEGORIES} item and a maximum of ${MAX_CATEGORIES} items`,
    ),
  body("status")
    .optional()
    .isIn(allowedStatus)
    .withMessage("Status must be active or inactive"),
];

const postQueryValidation = [
  query("status")
    .optional()
    .isIn(allowedStatus)
    .withMessage(`Status must be one of: ${allowedStatus.join(", ")}`),
  query("category")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Category must be a valid ID"),
  query("sort")
    .optional()
    .isIn(allowedSort)
    .withMessage(`Sort field must be one of: ${allowedSort.join(", ")}`),
  query("order")
    .optional()
    .isIn(allowedOrder)
    .withMessage('Order must be "asc" or "desc"'),
  query("limit")
    .optional()
    .isInt({ min: 1, max: MAX_QUERY_LIMIT })
    .toInt()
    .withMessage(`Limit must be a number between 1 and ${MAX_QUERY_LIMIT}`),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Page must be a positive number"),
  query("date_from")
    .optional()
    .isISO8601()
    .withMessage("Date From must be a valid date format (ISO8601)"),
  query("date_to")
    .optional()
    .isISO8601()
    .withMessage("Date To must be a valid date format (ISO8601)"),
  query("author_id")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Author ID must be a valid positive number"),
];

const postIdValidation = [
  param("post_id").isInt({ min: 1 }).withMessage("Valid post_id is required"),
];

export {
  postCreateValidation,
  postUpdateValidation,
  postQueryValidation,
  postIdValidation,
};
