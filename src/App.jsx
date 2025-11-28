import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginStudent from "./pages/LoginStudent.jsx";
import LoginTeacher from "./pages/LoginTeacher.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import SignupStudent from "./pages/SignupStudent.jsx";

import StudentDashboard from "./pages/StudentDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import TakeQuiz from "./pages/TakeQuiz.jsx";
import NotFound from "./pages/NotFound.jsx";

/* ✅ Updated Protected Component */
const Protected = ({ roles, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !roles.includes(role)) {
    return <Navigate to={`/login/${role || "student"}`} replace />;
  }
  return children;
};

const App = () => (
  <Routes>
    {/* Default redirect */}
    <Route path="/" element={<Navigate to="/login/student" />} />

    {/* Login & Signup */}
    <Route path="/login/student" element={<LoginStudent />} />
    <Route path="/login/teacher" element={<LoginTeacher />} />
    <Route path="/login/admin" element={<LoginAdmin />} />
    <Route path="/signup/student" element={<SignupStudent />} />

    {/* ✅ Student Dashboard */}
    <Route
      path="/student"
      element={
        <Protected roles={["student"]}>
          <StudentDashboard />
        </Protected>
      }
    />

    {/* ✅ Student Take Quiz Page */}
    <Route
      path="/student/quizzes/:id"
      element={
        <Protected roles={["student"]}>
          <TakeQuiz />
        </Protected>
      }
    />

    {/* ✅ Teacher Dashboard (Now includes Quiz Creation) */}
    <Route
      path="/teacher"
      element={
        <Protected roles={["teacher"]}>
          <TeacherDashboard />
        </Protected>
      }
    />

    {/* ✅ Admin Dashboard */}
    <Route
      path="/admin"
      element={
        <Protected roles={["admin"]}>
          <AdminDashboard />
        </Protected>
      }
    />

    {/* 404 Page */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
