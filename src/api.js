import axios from "axios";

const API = axios.create({
  baseURL: "/api"
});

// 🔹 Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// AUTH ENDPOINTS

export const login = (email, password, role) =>
  API.post("/auth/login", { email, password, role });

export const signupStudent = (body) =>
  API.post("/auth/signup/student", body);

// -------------------------
// STUDY MATERIALS
// -------------------------
export const fetchMaterials = () =>
  API.get("/materials", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

export const uploadMaterial = (formData) =>
  API.post("/materials/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

// -------------------------
// QUIZZES
// -------------------------
export const listQuizzes = () =>
  API.get("/quizzes", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

export const getQuiz = (id) =>
  API.get(`/quizzes/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

export const submitQuiz = (id, answers) =>
  API.post(
    `/quizzes/${id}/submit`,
    { answers },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

// -------------------------
// TEACHERS LIST (for students)
// -------------------------
export const listTeachers = () =>
  API.get("/teacher/list", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

// -------------------------
// ADMIN (only admin)
// -------------------------
export const adminListUsers = () =>
  API.get("/admin/users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

export const adminCreateUser = (body) =>
  API.post("/admin/users", body, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

export const adminDeleteUser = (id) =>
  API.delete(`/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

// -------------------------
// TEACHER EXPORT STUDENT RESULTS (Excel)
// -------------------------
export const exportResultsExcel = () =>
  API.get("/teacher/export-results", {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

export const generateQuizAI = (content) =>
  API.post("/ai/generate-quiz", { content }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });


export default API;
