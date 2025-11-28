import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="container d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
      <div className="col-md-5">
        <div className="card p-4 shadow-sm">
          <h2 className="text-center mb-3">EduQuiz+</h2>
          {children}
          <div className="text-center mt-3">
            <Link to="/">Back to Login Options</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
