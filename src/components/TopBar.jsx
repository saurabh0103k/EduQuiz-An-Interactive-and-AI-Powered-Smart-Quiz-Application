import React from "react";
import { useNavigate } from "react-router-dom";

const TopBar = ({ name, role }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate(`/login/${role}`);
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4>Welcome, {name}</h4>
      <button className="btn btn-danger btn-sm" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default TopBar;
