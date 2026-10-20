import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
    { name: "Add Transaction", path: "/add-transaction" },
    { name: "Categories", path: "/categories" },
    { name: "Budget", path: "/budget" },
    { name: "Reports", path: "/reports" },
    { name: "Profile", path: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Finance Tracker</h2>
        <p>Manage your money smartly</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {item.name}
          </NavLink>
        ))}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;