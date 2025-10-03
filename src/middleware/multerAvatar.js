// src/middleware/multerAvatar.js

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/avatars"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

function multerErrorHandler(err, req, res, next) {
  if (err) {
    if (err.name === "MulterError") {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .status(400)
          .json({ error: "Only one avatar image can be uploaded at a time." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err.message === "Only image files are allowed!") {
      return res.status(400).json({ error: err.message });
    } else {
      return res.status(400).json({ error: err.message });
    }
  }
  next();
}

export { upload, multerErrorHandler };
