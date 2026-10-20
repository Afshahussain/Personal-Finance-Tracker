import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import SummaryCard from "../components/SummaryCard";
import PageHeader from "../components/PageHeader";
import BASE_URL from "../api/baseurl";
import axios from "axios";
import "../styles/app.css";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}dashboard/summary/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  const summary = dashboardData || {
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
    total_monthly_budget: 0,
    total_categories: 0,
    total_transactions: 0,
    total_budgets: 0,
    recent_transactions: []
  };

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your personal finances"
      />

      {error && <div className="error-box" style={{marginBottom: "20px"}}>{error}</div>}

      {loading && !dashboardData ? (
        <p>Loading your dashboard...</p>
      ) : (
        <>
          <div className="summary-grid">
            <SummaryCard title="Total Income" value={`₹${summary.total_income || 0}`} />
            <SummaryCard title="Total Expense" value={`₹${summary.total_expense || 0}`} />
            <SummaryCard title="Net Balance" value={`₹${summary.net_balance || 0}`} />
            <SummaryCard title="Monthly Budget" value={`₹${summary.total_monthly_budget || 0}`} />
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <h3>Recent Transactions</h3>
              {summary.recent_transactions && summary.recent_transactions.length > 0 ? (
                <table className="custom-table" style={{ marginTop: "16px" }}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recent_transactions.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>
                          <span style={{ color: item.category_type === "Income" ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
                            {item.category_type}
                          </span>
                        </td>
                        <td>₹{item.amount}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No recent transactions found.</p>
              )}
            </div>

            <div className="card">
              <h3>System Insights</h3>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                <li style={{ marginBottom: "12px", background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
                  <strong>{summary.total_transactions || 0}</strong> total transactions tracked.
                </li>
                <li style={{ marginBottom: "12px", background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
                  <strong>{summary.total_categories || 0}</strong> active categories mapped.
                </li>
                <li style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
                  <strong>{summary.total_budgets || 0}</strong> specific budget rules configured.
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Dashboard;