import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { fetchMaterials, listQuizzes, listTeachers } from "../api";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const name = localStorage.getItem("name");
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    (async () => {
      // ✅ Load Study Materials safely
      try {
        const m = await fetchMaterials();
        setMaterials(m.data);
      } catch (err) {
        console.error("Error loading materials:", err);
        setMaterials([]);
      }

      // ✅ Load Assigned Quizzes safely
      try {
        const q = await listQuizzes();
        setQuizzes(q.data);
      } catch (err) {
        console.error("Error loading quizzes:", err);
        setQuizzes([]);
      }

      // ✅ Load Teachers safely (not admin endpoint)
      try {
        const t = await listTeachers();
        setTeachers(t.data);
      } catch (err) {
        console.error("Error loading teachers:", err);
        setTeachers([]);
      }
    })();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />
      <main className="dashboard-main">
        <TopBar name={name} role="student" />

        <div className="row g-3">

          {/* ✅ Study Materials Section */}
          <div className="col-lg-6">
            <div className="card p-3">
              <h5>Study Materials</h5>
              <ul className="list-group mt-2">
                {materials.map((m) => (
                  <li
                    key={m.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    {m.title || m.file_name}
                    <a
                      href={`/uploads/materials/${m.file_path}`}
                      className="btn btn-sm btn-outline-primary"
                      download
                    >
                      Download
                    </a>
                  </li>
                ))}
                {!materials.length && (
                  <p className="text-muted mt-2">No materials yet</p>
                )}
              </ul>
            </div>
          </div>

          {/* ✅ Assigned Quizzes Section */}
          <div className="col-lg-6">
            <div className="card p-3">
              <h5>Assigned Quizzes</h5>
              <ul className="list-group mt-2">
                {quizzes.map((q) => (
                  <li
                    key={q.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    {q.title}
                    <Link
                      to={`/student/quizzes/${q.id}`}
                      className="btn btn-sm btn-success"
                    >
                      Take Quiz
                    </Link>
                  </li>
                ))}
                {!quizzes.length && (
                  <p className="text-muted mt-2">No quizzes assigned</p>
                )}
              </ul>
            </div>
          </div>

          {/* ✅ Teachers Section */}
          <div className="col-lg-12">
            <div className="card p-3">
              <h5>Your Teachers / Mentors</h5>
              <ul className="list-group mt-2">
                {teachers.map((t) => (
                  <li key={t.id} className="list-group-item">
                    {t.full_name}
                  </li>
                ))}
                {!teachers.length && (
                  <p className="text-muted mt-2">No teachers available</p>
                )}
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
