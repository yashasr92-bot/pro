const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ============================
// REGISTER (SAFE)
// ============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // basic validation
    if (!name || !email || !password || !role) {
      return res.json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    await newUser.save();

    // ✅ IMPORTANT: send user back (for frontend)
    res.json({
      message: "Registered successfully",
      user: newUser,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================
// LOGIN (SAFE)
// ============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ message: "Wrong password" });
    }

    // ✅ IMPORTANT: send user back
    res.json({
      message: "Login successful",
      user: user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;