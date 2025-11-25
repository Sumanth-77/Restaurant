const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt - Email:", email);
    console.log("Admin email from env:", ADMIN_EMAIL);

    // Check if admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log("Admin login successful");
      const token = jwt.sign(
        { email: ADMIN_EMAIL, isAdmin: true },
        process.env.JWT_SECRET
      );
      return res.json({
        token,
        user: { email: ADMIN_EMAIL, name: "Admin" },
        isAdmin: true,
      });
    }

    // Check regular user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
      isAdmin: false,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
      isAdmin: false,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;