import { body, validationResult } from "express-validator";

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 0;
const MAX_DESCRIPTION_LENGTH = 50000;

const categoryCreateValidation = [
  body("title")
    .isLength({ min: MIN_TITLE_LENGTH, max: MAX_TITLE_LENGTH })
    .withMessage(
      `Title is required and must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters long`,
    ),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: MIN_DESCRIPTION_LENGTH, max: MAX_DESCRIPTION_LENGTH })
    .withMessage(
      `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`,
    ),
];

const categoryUpdateValidation = [
  body("title")
    .optional()
    .isLength({ min: MIN_TITLE_LENGTH, max: MAX_TITLE_LENGTH })
    .withMessage(
      `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters long`,
    ),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: MIN_DESCRIPTION_LENGTH, max: MAX_DESCRIPTION_LENGTH })
    .withMessage(
      `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`,
    ),
];

export { categoryCreateValidation, categoryUpdateValidation };
