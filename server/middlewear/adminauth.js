const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Only admin can access" });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid admin token" });
  }
};

module.exports = adminAuth;
