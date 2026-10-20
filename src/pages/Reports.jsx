import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import BASE_URL from "../api/baseurl";
import axios from "axios";
import "../styles/app.css";

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}dashboard/reports/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load report data.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [token]);

  const summary = reportData?.monthly_summary?.[0] || { income: 0, expense: 0, net_savings: 0 };
  const incomeReport = reportData?.income_report || [];
  const expenseReport = reportData?.expense_report || [];
  const budgetReport = reportData?.budget_vs_spent || [];

  return (
    <AppLayout>
      <PageHeader
        title="Reports"
        subtitle="Analyze your financial data and summaries"
      />

      {error && <div className="error-box" style={{marginBottom: "20px"}}>{error}</div>}

      {loading ? (
        <p>Loading reports...</p>
      ) : reportData ? (
        <>
          {/* 1. Monthly Summary */}
          <div className="summary-grid" style={{ marginBottom: "24px" }}>
            <div className="summary-card">
              <h4>Total Income</h4>
              <h2 style={{ color: "#16a34a" }}>₹{summary.income}</h2>
            </div>
            <div className="summary-card">
              <h4>Total Expense</h4>
              <h2 style={{ color: "#dc2626" }}>₹{summary.expense}</h2>
            </div>
            <div className="summary-card">
              <h4>Net Savings</h4>
              <h2 style={{ color: parseFloat(summary.net_savings) >= 0 ? "#2563eb" : "#dc2626" }}>
                ₹{summary.net_savings}
              </h2>
            </div>
          </div>

          <div className="reports-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "24px" }}>
            {/* 2. Income Report */}
            <div className="card">
              <h3>Income by Category</h3>
              {incomeReport.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {incomeReport.map((inc) => (
                    <li key={inc.category_id} style={{ display: "flex", justifyContent: "space-between", margin: "10px 0", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                      <span>{inc.category_name}</span>
                      <strong style={{ color: "#16a34a" }}>₹{inc.total_amount}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No income recorded this month.</p>
              )}
            </div>

            {/* 3. Expense Report */}
            <div className="card">
              <h3>Expense by Category</h3>
              {expenseReport.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {expenseReport.map((exp) => (
                    <li key={exp.category_id} style={{ display: "flex", justifyContent: "space-between", margin: "10px 0", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
                      <span>{exp.category_name}</span>
                      <strong style={{ color: "#dc2626" }}>₹{exp.total_amount}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No expenses recorded this month.</p>
              )}
            </div>
          </div>

          {/* 4. Budget vs Spent Deep-Dive */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <h3>Budget vs Spent</h3>
            {budgetReport.length > 0 ? (
              <table className="custom-table" style={{ marginTop: "16px" }}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Budget Limit</th>
                    <th>Spent Amount</th>
                    <th>Remaining</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetReport.map((item) => {
                    const isExceeded = parseFloat(item.spent_amount) > parseFloat(item.budget_amount);
                    return (
                      <tr key={item.category_id}>
                        <td>{item.category_name}</td>
                        <td>₹{item.budget_amount}</td>
                        <td style={{ color: isExceeded ? "#dc2626" : "inherit" }}>₹{item.spent_amount}</td>
                        <td>₹{item.remaining_amount}</td>
                        <td>
                          <span style={{
                            padding: "4px 8px", 
                            borderRadius: "4px", 
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            backgroundColor: isExceeded ? "#fee2e2" : "#dcfce7",
                            color: isExceeded ? "#b91c1c" : "#166534"
                          }}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No active budget rules or expenses to contrast.</p>
            )}
          </div>
        </>
      ) : (
        <p>No report data available.</p>
      )}
    </AppLayout>
  );
};

export default Reports;