import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import "../styles/app.css";

const Settings = () => {
  const [currency, setCurrency] = useState("INR");
  const [theme, setTheme] = useState("Light");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setMessage("Settings saved successfully!");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        subtitle="Manage your application preferences"
      />

      <div className="form-card">
        {message && <div className="success-box">{message}</div>}

        <div className="form-group">
          <label>Default Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="form-group">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        <button className="primary-btn" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </AppLayout>
  );
};

export default Settings;