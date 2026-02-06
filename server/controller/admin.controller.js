const jwt = require("jsonwebtoken");
require("dotenv").config();

const Adminlogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const adminEmail = process.env.Admin_email;
  const adminPassword = process.env.Admin_password;
  const secretKey = process.env.JWT_SECRET;

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  }

  const token = jwt.sign({ email, role: "admin" }, secretKey, {
    expiresIn: "5h",
  });

  res.json({ success: true, token });
};

module.exports = Adminlogin;
