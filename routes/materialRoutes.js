const express = require("express");
const path = require("path");
const multer = require("multer");
const pool = require("../config/db");
const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// storage for PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "materials"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF allowed"));
  }
});

// teacher upload material (PDF)
router.post(
  "/upload",
  auth,
  allowRoles("teacher"),
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Auto-fill required fields since frontend doesn't send title/description
      const title = file.originalname;
      const description = "";

      await pool.query(
        "INSERT INTO study_materials (title, description, file_name, file_path, uploaded_by) VALUES (?,?,?,?,?)",
        [title, description, file.originalname, file.filename, req.user.id]
      );

      res.json({ message: "Material uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// list materials (for students & teachers)
router.get("/", auth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT m.id,m.title,m.description,m.file_name,m.file_path,m.created_at,
            u.full_name AS teacher_name
     FROM study_materials m
     LEFT JOIN users u ON u.id=m.uploaded_by
     ORDER BY m.created_at DESC`
  );
  res.json(rows);
});

module.exports = router;
