import React from "react";

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <header className="topbar">
      <div>
        <h3>Welcome back</h3>
        <p>Track your financial activity daily</p>
      </div>

      <div className="topbar-user" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: '500' }}>{user.name || "User"}</span>
      </div>
    </header>
  );
};

export default Topbar;