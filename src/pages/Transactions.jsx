import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import BASE_URL from "../api/baseurl";
import axios from "axios";
import "../styles/app.css";

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterCategory, setFilterCategory] = useState("All Categories");

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, catRes] = await Promise.all([
        axios.get(`${BASE_URL}transactions/list/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}category/list/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setTransactions(txRes.data.data || []);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await axios.delete(`${BASE_URL}transactions/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All Types" || t.category_type === filterType;
    // t.category is the ID, so we check against filterCategory ID
    const matchesCategory = filterCategory === "All Categories" || t.category.toString() === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <AppLayout>
      <PageHeader
        title="Transactions"
        subtitle="Manage all your income and expense records"
        buttonText="Add Transaction"
        onButtonClick={() => navigate("/add-transaction")}
      />

      {error && <div className="error-box" style={{marginBottom: "20px"}}>{error}</div>}

      <div className="filter-bar">
        <input 
          type="text" 
          placeholder="Search transaction..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option>All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All Categories">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id.toString()}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        {loading && transactions.length === 0 ? (
          <p>Loading transactions...</p>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category_name}</td>
                  <td>{item.category_type}</td>
                  <td>₹{item.amount}</td>
                  <td>{item.payment_mode}</td>
                  <td>{item.date}</td>
                  <td>
                    <button className="table-btn edit" onClick={() => navigate("/add-transaction", { state: { transaction: item } })}>Edit</button>
                    <button className="table-btn delete" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
};

export default Transactions;