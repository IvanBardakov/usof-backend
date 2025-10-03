// src/middleware/verifiedMiddleware.js

function verifiedMiddleware(req, res, next) {
  if (!req.user || !req.user.email_confirmed) {
    return res.status(403).json({ error: "Email not verified" });
  }
  next();
}

export default verifiedMiddleware;
