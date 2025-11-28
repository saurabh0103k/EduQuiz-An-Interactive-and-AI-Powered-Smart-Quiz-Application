import React, { useState } from "react";
import Layout from "../components/Layout";
import { signupStudent } from "../api";
import { useNavigate } from "react-router-dom";

const SignupStudent = () => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    course: "",
    roll_no: ""
  });

  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signupStudent(form);
      setMsg("Account created! You can now login.");
      setTimeout(() => navigate("/login/student"), 1200);
    } catch (e) {
      setErr("Signup failed");
    }
  };

  return (
    <Layout>
      <h4 className="mb-3">Student Signup</h4>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={submit}>
        <div className="mb-2">
          <label>Full Name</label>
          <input name="full_name" className="form-control" value={form.full_name} onChange={onChange} />
        </div>
        <div className="mb-2">
          <label>Email</label>
          <input name="email" className="form-control" value={form.email} onChange={onChange} />
        </div>
        <div className="mb-2">
          <label>Password</label>
          <input name="password" type="password" className="form-control" value={form.password} onChange={onChange} />
        </div>
        <div className="mb-2">
          <label>Course</label>
          <input name="course" className="form-control" value={form.course} onChange={onChange} />
        </div>
        <div className="mb-2">
          <label>Roll No</label>
          <input name="roll_no" className="form-control" value={form.roll_no} onChange={onChange} />
        </div>

        <button className="btn btn-success w-100 mt-2">Signup</button>
      </form>
    </Layout>
  );
};

export default SignupStudent;
