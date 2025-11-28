require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const materialRoutes = require("./routes/materialRoutes");
const quizRoutes = require("./routes/quizRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// static for PDFs and excel
app.use(
  "/uploads/materials",
  express.static(path.join(__dirname, "uploads", "materials"))
);
app.use(
  "/uploads/exports",
  express.static(path.join(__dirname, "uploads", "exports"))
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
