const adminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied! Admins only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = adminMiddleware;
