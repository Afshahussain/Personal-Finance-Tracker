import React from "react";
import { Link } from "react-router-dom";
import "../styles/app.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="primary-btn">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;