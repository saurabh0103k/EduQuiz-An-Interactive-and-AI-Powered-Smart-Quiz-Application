// ✅ EXPORT STUDENT RESULTS TO EXCEL
const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const ExcelJS = require("exceljs");

const router = express.Router();

router.get("/export-results", auth, allowRoles("teacher"), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.full_name AS student_name,
        u.course,
        u.roll_no,
        qa.score,
        q.title AS quiz_title,
        qa.attempted_at
      FROM quiz_attempts qa
      LEFT JOIN users u ON u.id = qa.student_id
      LEFT JOIN quizzes q ON q.id = qa.quiz_id
      ORDER BY qa.attempted_at DESC
    `);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Student Records");

    sheet.columns = [
      { header: "Student Name", key: "student_name", width: 25 },
      { header: "Course", key: "course", width: 15 },
      { header: "Roll No", key: "roll_no", width: 15 },
      { header: "Quiz Title", key: "quiz_title", width: 25 },
      { header: "Score", key: "score", width: 10 },
      { header: "Attempted At", key: "attempted_at", width: 20 },
    ];

    rows.forEach((r) => sheet.addRow(r));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=student-records.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("EXPORT ERROR:", err);
    res.status(500).json({ message: "Export failed" });
  }
});

module.exports = router;
