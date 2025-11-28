import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { adminListUsers, adminCreateUser, adminDeleteUser } from "../api";

const AdminDashboard = () => {
  const name = localStorage.getItem("name");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "teacher",
    course: "",
    roll_no: ""
  });

  const loadUsers = async () => {
    const { data } = await adminListUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await adminCreateUser(form);
    loadUsers();
  };

  const removeUser = async (id) => {
    await adminDeleteUser(id);
    loadUsers();
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <TopBar name={name} role="admin" />

        <div className="row g-3">

          <div className="col-lg-4">
            <div className="card p-3">
              <h5>Create User</h5>
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
                  <input name="password" className="form-control" value={form.password} onChange={onChange} />
                </div>
                <div className="mb-2">
                  <label>Role</label>
                  <select name="role" className="form-select" value={form.role} onChange={onChange}>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                {form.role === "student" && (
                  <>
                    <div className="mb-2">
                      <label>Course</label>
                      <input name="course" className="form-control" value={form.course} onChange={onChange} />
                    </div>
                    <div className="mb-2">
                      <label>Roll No</label>
                      <input name="roll_no" className="form-control" value={form.roll_no} onChange={onChange} />
                    </div>
                  </>
                )}

                <button className="btn btn-primary w-100 mt-2">Create</button>
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card p-3">
              <h5>Users List</h5>
              <table className="table mt-2">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => removeUser(u.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">No users yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
