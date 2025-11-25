const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Remove "Bearer " from token if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Changed from req.user
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;