const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// Student signup (with course & roll_no)
router.post("/signup/student", async (req, res) => {
  try {
    const { full_name, email, password, course, roll_no } = req.body;

    const [rows] = await pool.query("SELECT id FROM users WHERE email=?", [
      email
    ]);
    if (rows.length) return res.status(400).json({ message: "Email already used" });

    await pool.query(
      "INSERT INTO users (full_name,email,password,role,course,roll_no) VALUES (?,?,?,?,?,?)",
      [full_name, email, password, "student", course, roll_no]
    );

    res.json({ message: "Student registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login (for all roles)
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email=? AND role=?",
      [email, role]
    );

    if (!rows.length)
      return res.status(400).json({ message: "User not found" });

    const user = rows[0];

    // PLAIN TEXT comparison
    if (user.password !== password)
      return res.status(400).json({ message: "Wrong password" });

    const token = generateToken(user);
    res.json({ token, role: user.role, full_name: user.full_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
