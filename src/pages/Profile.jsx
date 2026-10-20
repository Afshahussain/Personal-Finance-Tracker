import React from "react";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import "../styles/app.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Demo User",
    email: "demo@example.com",
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <AppLayout>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information securely"
      />

      <div className="card" style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        
        <div style={{
          width: "100px", 
          height: "100px", 
          borderRadius: "50%", 
          background: "linear-gradient(135deg, #2563eb, #8b5cf6)", 
          color: "white", 
          fontSize: "40px", 
          fontWeight: "bold", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          margin: "0 auto 24px auto"
        }}>
          {getInitial(user.name)}
        </div>

        <h2 style={{ marginBottom: "8px", fontSize: "24px", color: "#111827" }}>{user.name}</h2>
        <p style={{ color: "#6b7280", marginBottom: "32px", fontSize: "16px" }}>{user.email}</p>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", textAlign: "left", width: "100%", maxWidth: "400px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontWeight: "600", color: "#374151" }}>Account Status</span>
            <span style={{ color: "#16a34a", fontWeight: "bold", background: "#dcfce7", padding: "4px 12px", borderRadius: "16px", fontSize: "14px" }}>
              Active
            </span>
          </div>
          
        </div>

      </div>
    </AppLayout>
  );
};

export default Profile;