import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import BASE_URL from "../api/baseurl";
import axios from "axios";
import "../styles/app.css";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({ category: "", amount: "", month: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetRes, catRes] = await Promise.all([
        axios.get(`${BASE_URL}budget/list/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}category/list/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setBudgets(budgetRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (budget = null) => {
    setError("");
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        category: budget.category,
        amount: budget.amount,
        month: budget.month,
      });
    } else {
      setEditingBudget(null);
      setFormData({ category: "", amount: "", month: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
    setFormData({ category: "", amount: "", month: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.month) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        category: parseInt(formData.category, 10),
        amount: String(formData.amount),
        month: formData.month,
      };

      if (editingBudget) {
        await axios.put(`${BASE_URL}budget/update/${editingBudget.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${BASE_URL}budget/create/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchData(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget limit?")) return;
    try {
      await axios.delete(`${BASE_URL}budget/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Budget"
        subtitle="Track category-wise budget limits"
        buttonText="Set Budget"
        onButtonClick={() => openModal()}
      />

      {error && <div className="error-box" style={{marginBottom: "20px"}}>{error}</div>}

      <div className="budget-grid">
        {loading && budgets.length === 0 ? (
          <p>Loading budgets...</p>
        ) : (
          budgets.length > 0 ? (
            budgets.map((item) => (
              <div className="card" key={item.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0 }}>{item.category_name} ({item.category_type})</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="table-btn edit" onClick={() => openModal(item)}>Edit</button>
                    <button className="table-btn delete" onClick={() => handleDelete(item.id)}>Delete</button>
                  </div>
                </div>
                <p><strong>Limit:</strong> ₹{item.amount}</p>
                <p><strong>Month:</strong> {item.month}</p>
              </div>
            ))
          ) : (
            <p className="no-data">No active budgets found. Set one up!</p>
          )
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingBudget ? "Edit Budget" : "Set Budget"}</h3>
            {error && <div className="error-box" style={{marginBottom: "15px"}}>{error}</div>}
            
            <form className="custom-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Amount Limit</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  placeholder="e.g. 5000"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Month</label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Budget;