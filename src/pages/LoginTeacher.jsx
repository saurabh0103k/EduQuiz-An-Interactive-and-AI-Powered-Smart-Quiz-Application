import React, { useState } from "react";
import Layout from "../components/Layout";
import { login } from "../api";
import { useNavigate } from "react-router-dom";

const LoginTeacher = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(email, password, "teacher");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.full_name);
      navigate("/teacher");
    } catch (e) {
      setErr("Invalid credentials");
    }
  };

  return (
    <Layout>
      <h4 className="mb-3">Teacher Login</h4>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit}>
        <div className="mb-2">
          <label>Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Password</label>
          <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        <button className="btn btn-primary w-100 mt-2">Login</button>
      </form>
    </Layout>
  );
};

export default LoginTeacher;
