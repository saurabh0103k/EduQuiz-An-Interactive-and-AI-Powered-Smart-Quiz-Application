const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// create teacher or student
router.post("/users", auth, allowRoles("admin"), async (req, res) => {
  try {
    const { full_name, email, password, role, course, roll_no } = req.body;
    if (!["teacher", "student"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const [rows] = await pool.query("SELECT id FROM users WHERE email=?", [
      email
    ]);
    if (rows.length) return res.status(400).json({ message: "Email already used" });

    await pool.query(
      "INSERT INTO users (full_name,email,password,role,course,roll_no) VALUES (?,?,?,?,?,?)",
      [full_name, email, password, role, course || null, roll_no || null]
    );

    res.json({ message: `${role} created` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// list users except admin
router.get("/users", auth, allowRoles("admin"), async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id,full_name,email,role,course,roll_no,created_at FROM users WHERE role<>'admin'"
  );
  res.json(rows);
});

// delete
router.delete("/users/:id", auth, allowRoles("admin"), async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=?", [req.params.id]);
  res.json({ message: "User deleted" });
});

module.exports = router;
