import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import BASE_URL from "../api/baseurl";
import axios from "axios";
import "../styles/app.css";

const AddTransaction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingTransaction = location.state?.transaction || null;

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    payment_mode: "",
    date: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}category/list/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res.data.data || []);
      } catch (err) {
        setError("Failed to load categories.");
      }
    };
    fetchCategories();

    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title || "",
        amount: editingTransaction.amount || "",
        category: editingTransaction.category || "",
        payment_mode: editingTransaction.payment_mode || "",
        date: editingTransaction.date || "",
        description: editingTransaction.description || "",
      });
    }
  }, [editingTransaction, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const selectedCategory = categories.find(
    (item) => item.id.toString() === formData.category.toString()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        title: formData.title,
        amount: String(formData.amount),
        category: parseInt(formData.category, 10),
        payment_mode: formData.payment_mode,
        date: formData.date,
        description: formData.description,
      };

      if (editingTransaction) {
        await axios.put(`${BASE_URL}transactions/update/${editingTransaction.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${BASE_URL}transactions/create/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      navigate("/transactions");
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        subtitle={editingTransaction ? "Update your transaction details" : "Add your income or expense record"}
      />

      <div className="form-card">
        <form className="custom-form" onSubmit={handleSubmit}>
          {error && <div className="error-box" style={{marginBottom: "20px"}}>{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter transaction title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Payment Mode</label>
              <select
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
                required
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category Type</label>
              <input
                type="text"
                value={selectedCategory ? selectedCategory.type : ""}
                placeholder="Auto-filled from category"
                readOnly
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : (editingTransaction ? "Update Transaction" : "Save Transaction")}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default AddTransaction;