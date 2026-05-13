const sellerMiddleware = (req, res, next) => {
  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(403).json({ msg: "Only sellers or admins can access this" });
  }
  next();
};

module.exports = sellerMiddleware;
