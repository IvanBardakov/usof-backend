// src/middleware/sessionAuthMiddleware.js
import userModel from "../models/User.js";

async function sessionAuthMiddleware(req, res, next) {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const dbUser = await userModel.findById(req.session.user.id);

    if (!dbUser) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = {
      id: dbUser.id,
      login: dbUser.login,
      role: dbUser.role,
      email_confirmed: dbUser.email_confirmed,
    };

    return next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Session validation failed", details: err.message });
  }
}

export default sessionAuthMiddleware;
