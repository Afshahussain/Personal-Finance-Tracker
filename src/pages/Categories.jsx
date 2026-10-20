import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import BASE_URL from "../api/baseurl";
import axios from "axios";
import "../styles/app.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "Expense" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}category/list/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    setError("");
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, type: category.type });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", type: "Expense" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", type: "Expense" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (editingCategory) {
        // Update
        await axios.put(`${BASE_URL}category/update/${editingCategory.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create
        await axios.post(`${BASE_URL}category/create/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchCategories(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${BASE_URL}category/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete.");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Categories"
        subtitle="Organize your transactions by categories"
        buttonText="Add Category"
        onButtonClick={() => openModal()}
      />

      {error && <div className="error-box" style={{marginBottom: "20px"}}>{error}</div>}

      <div className="card">
        {loading && categories.length === 0 ? (
          <p>Loading categories...</p>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td>
                    <button className="table-btn edit" onClick={() => openModal(item)}>Edit</button>
                    <button className="table-btn delete" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    No categories found. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingCategory ? "Edit Category" : "Add Category"}</h3>
            {error && <div className="error-box" style={{marginBottom: "15px"}}>{error}</div>}
            
            <form className="custom-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Groceries"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
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

export default Categories;