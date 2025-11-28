const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// teacher creates quiz with questions
router.post("/", auth, allowRoles("teacher"), async (req, res) => {
  const { title, description, questions } = req.body;
  const [result] = await pool.query(
    "INSERT INTO quizzes (title,description,created_by,is_published) VALUES (?,?,?,1)",
    [title, description, req.user.id]
  );
  const quizId = result.insertId;

  for (const q of questions) {
    await pool.query(
      `INSERT INTO quiz_questions
       (quiz_id,question_text,option_a,option_b,option_c,option_d,correct_option)
       VALUES (?,?,?,?,?,?,?)`,
      [
        quizId,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option
      ]
    );
  }

  res.json({ message: "Quiz created", quizId });
});

// list quizzes
router.get("/", auth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT q.id,q.title,q.description,q.created_at,u.full_name AS teacher_name
     FROM quizzes q
     LEFT JOIN users u ON u.id=q.created_by
     WHERE q.is_published=1
     ORDER BY q.created_at DESC`
  );
  res.json(rows);
});

// get quiz with questions
router.get("/:id", auth, async (req, res) => {
  const quizId = req.params.id;
  const [[quiz]] = await pool.query("SELECT * FROM quizzes WHERE id=?", [
    quizId
  ]);
  const [questions] = await pool.query(
    "SELECT id,question_text,option_a,option_b,option_c,option_d FROM quiz_questions WHERE quiz_id=?",
    [quizId]
  );
  res.json({ quiz, questions });
});

// submit quiz
router.post("/:id/submit", auth, allowRoles("student"), async (req, res) => {
  const quizId = req.params.id;
  const { answers } = req.body; // [{question_id,selected_option}]

  const [rows] = await pool.query(
    "SELECT id,correct_option FROM quiz_questions WHERE quiz_id=?",
    [quizId]
  );
  const correct = {};
  rows.forEach((q) => (correct[q.id] = q.correct_option));

  let score = 0;
  for (const a of answers) {
    if (correct[a.question_id] === a.selected_option) score++;
  }

  await pool.query(
    "INSERT INTO quiz_attempts (quiz_id,student_id,score) VALUES (?,?,?)",
    [quizId, req.user.id, score]
  );

  res.json({ message: "Submitted", score, total: rows.length });
});

module.exports = router;
