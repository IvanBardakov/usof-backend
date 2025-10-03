// src/middleware/likeValidation.js
import { body } from "express-validator";

const likeCreateValidation = [
  body("type")
    .isIn(["like", "dislike"])
    .withMessage("Type must be like or dislike"),
];

export { likeCreateValidation };
