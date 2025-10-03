// src/middleware/roleMiddleware.js

function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient privileges" });
    }
    next();
  };
}

export default roleMiddleware;
