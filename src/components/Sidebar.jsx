import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <h5 className="p-3">Menu</h5>
      <ul className="nav flex-column">

        {/* Student Sidebar */}
        {role === "student" && (
          <>
            <li className="nav-item">
              <Link to="/student" className="nav-link">
                Dashboard
              </Link>
            </li>
          </>
        )}

        {/* Teacher Sidebar */}
        {role === "teacher" && (
          <>
            <li className="nav-item">
              <Link to="/teacher" className="nav-link">
                Dashboard / Create Quiz
              </Link>
            </li>
          </>
        )}

        {/* Admin Sidebar */}
        {role === "admin" && (
          <>
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                Admin Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/manage-users" className="nav-link">
                Manage Users
              </Link>
            </li>
          </>
        )}

      </ul>
    </div>
  );
};

export default Sidebar;
