import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { uploadMaterial, exportResultsExcel, generateQuizAI } from "../api";
import API from "../api";

const TeacherDashboard = () => {
  const name = localStorage.getItem("name");

  /* ===========================================================
     ✅ STUDY MATERIAL UPLOAD
  ============================================================== */
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadMaterial(formData);
      setUploadMsg("Material uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      setUploadMsg("Upload failed");
    }
  };

  /* ===========================================================
     ✅ AI QUIZ GENERATOR
  ============================================================== */
  const [aiContent, setAiContent] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const generateAIQuizContent = async () => {
    if (!aiContent.trim()) return;

    setAiLoading(true);

    try {
      const res = await generateQuizAI(aiContent);
      setQuestions(res.data.questions);
    } catch (err) {
      console.error(err);
      alert("AI Quiz generation failed");
    }

    setAiLoading(false);
  };

  /* ===========================================================
     ✅ MANUAL QUIZ CREATION
  ============================================================== */
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [quizMsg, setQuizMsg] = useState("");

  const [questions, setQuestions] = useState([
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const submitQuiz = async () => {
    try {
      await API.post("/quizzes", {
        title: quizTitle,
        description: quizDesc,
        questions
      });

      setQuizMsg("Quiz created successfully!");
      setQuizTitle("");
      setQuizDesc("");
      setAiContent("");
      setQuestions([
        { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" }
      ]);
    } catch (err) {
      console.error(err);
      setQuizMsg("Quiz creation failed");
    }
  };

  /* ===========================================================
     ✅ EXPORT STUDENT RESULTS (EXCEL)
  ============================================================== */
  const downloadExcel = async () => {
    const res = await exportResultsExcel();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-records.xlsx";
    a.click();
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="teacher" />
      <main className="dashboard-main">
        <TopBar name={name} role="teacher" />

        {/* ✅ Material Upload Message */}
        {uploadMsg && <div className="alert alert-success">{uploadMsg}</div>}

        {/* ✅ UPLOAD STUDY MATERIAL */}
        <div className="card p-3 mb-3">
          <h5>Upload Study Material (PDF)</h5>
          <input type="file" className="form-control mt-2" onChange={(e) => setFile(e.target.files[0])} />
          <button className="btn btn-primary mt-3" onClick={upload}>
            Upload
          </button>
        </div>

        {/* ✅ AI QUIZ GENERATOR */}
        <div className="card p-3 mb-3">
          <h5>AI Quiz Generator</h5>
          <textarea
            className="form-control mt-2"
            placeholder="Paste study content here..."
            rows="5"
            value={aiContent}
            onChange={(e) => setAiContent(e.target.value)}
          />
          <button
            className="btn btn-warning mt-3"
            onClick={generateAIQuizContent}
            disabled={aiLoading}
          >
            {aiLoading ? "Generating..." : "Generate Quiz with AI"}
          </button>
        </div>

        {/* ✅ QUIZ CREATION */}
        {quizMsg && <div className="alert alert-info">{quizMsg}</div>}

        <div className="card p-3 mb-3">
          <h5>Create Quiz</h5>

          <label className="mt-2">Quiz Title</label>
          <input className="form-control" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />

          <label className="mt-2">Description</label>
          <input className="form-control" value={quizDesc} onChange={(e) => setQuizDesc(e.target.value)} />

          <h6 className="mt-3">Questions</h6>

          {questions.map((q, index) => (
            <div key={index} className="border p-2 mt-2 rounded">
              <input
                placeholder="Question text"
                className="form-control mb-2"
                value={q.question_text}
                onChange={(e) => updateQuestion(index, "question_text", e.target.value)}
              />

              <input
                placeholder="Option A"
                className="form-control mb-2"
                value={q.option_a}
                onChange={(e) => updateQuestion(index, "option_a", e.target.value)}
              />

              <input
                placeholder="Option B"
                className="form-control mb-2"
                value={q.option_b}
                onChange={(e) => updateQuestion(index, "option_b", e.target.value)}
              />

              <input
                placeholder="Option C"
                className="form-control mb-2"
                value={q.option_c}
                onChange={(e) => updateQuestion(index, "option_c", e.target.value)}
              />

              <input
                placeholder="Option D"
                className="form-control mb-2"
                value={q.option_d}
                onChange={(e) => updateQuestion(index, "option_d", e.target.value)}
              />

              <select
                className="form-control"
                value={q.correct_option}
                onChange={(e) => updateQuestion(index, "correct_option", e.target.value)}
              >
                <option value="">Select Correct Answer</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </div>
          ))}

          <button className="btn btn-secondary mt-3" onClick={addQuestion}>
            + Add Question
          </button>

          <button className="btn btn-success mt-3 ms-2" onClick={submitQuiz}>
            Save Quiz
          </button>
        </div>

        {/* ✅ DOWNLOAD STUDENT EXCEL */}
        <div className="card p-3">
          <h5>Download Student Records</h5>
          <button className="btn btn-success mt-2" onClick={downloadExcel}>
            Download Excel
          </button>
        </div>

      </main>
    </div>
  );
};

export default TeacherDashboard;
