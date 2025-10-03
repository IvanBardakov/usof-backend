function adminErrorHandler(err, req, res, next) {
  if (err && err.code === "ER_DUP_ENTRY") {
    return res
      .status(400)
      .json({
        error: "You have already liked or disliked this post or comment.",
      });
  }
  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ error: "Internal server error" });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });

}

export default adminErrorHandler;
