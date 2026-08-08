import React, { useEffect, useState } from "react";
import api from "../api/api";

// --- Reusable Spinners ---
const Spinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const ButtonSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
);

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0], // default today
    vendor: "",
    receipt_file: null,
  });

  // Filters
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [searchText, setSearchText] = useState("");

  // --- Fetch Expenses ---
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("expenses/");
      console.log("Loaded expenses:", res.data);
      setExpenses(res.data || []);
      setFilteredExpenses(res.data || []);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError("Could not load expense records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // --- Search & Filter Logic ---
  useEffect(() => {
    let result = [...expenses];

    // Search: description / vendor
    if (searchText.trim()) {
      const term = searchText.toLowerCase();
      result = result.filter(e =>
        e.description?.toLowerCase().includes(term) ||
        e.vendor?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (filterCategory) {
      result = result.filter(e => e.category === filterCategory);
    }

    // Filter date range
    if (filterDateFrom) {
      result = result.filter(e => new Date(e.date) >= new Date(filterDateFrom));
    }
    if (filterDateTo) {
      result = result.filter(e => new Date(e.date) <= new Date(filterDateTo));
    }

    setFilteredExpenses(result);
  }, [expenses, searchText, filterCategory, filterDateFrom, filterDateTo]);

  // --- Handle form input change ---
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
    setSuccess(""); setError("");
  };

  // --- Submit New Expense ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.date) {
      return setError("Category, Amount and Date are required.");
    }
    if (Number(formData.amount) <= 0) return setError("Amount must be greater than zero.");

    try {
      setSubmitting(true);
      setError(""); setSuccess("");

      // Use FormData if uploading file
      const submitData = new FormData();
      submitData.append("category", formData.category);
      submitData.append("amount", formData.amount);
      submitData.append("description", formData.description);
      submitData.append("date", formData.date);
      submitData.append("vendor", formData.vendor);
      if (formData.receipt_file) submitData.append("receipt_file", formData.receipt_file);

      await api.post("expenses/add/", submitData, { headers: { "Content-Type": "multipart/form-data" } });

      setSuccess("✅ Expense recorded successfully!");
      // Reset form
      setFormData({
        category: "", amount: "", description: "",
        date: new Date().toISOString().split('T')[0], vendor: "", receipt_file: null
      });
      fetchExpenses(); // Refresh list
    } catch (err) {
      console.error("Failed to save expense:", err);
      setError(err.response?.data?.detail || "Failed to record expense. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Total Expense Calculation ---
  const totalExpense = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  if (loading) return <Spinner />;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Expense Manager</h1>
          <p className="text-gray-500 mt-1 text-sm">Record, view and track all school operational expenses</p>
        </div>
        <button onClick={fetchExpenses} className="milk-btn whitespace-nowrap">
          🔄 Refresh
        </button>
      </div>

      {/* Status Messages */}
      {error && <div className="card bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}
      {success && <div className="card bg-green-50 border border-green-200 text-green-700 p-4">{success}</div>}

      {/* --- Add New Expense Form --- */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Record New Expense</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-lable">Expense Category *</label>
            <select name="category" className="milk-input w-full" value={formData.category} onChange={handleChange} required>
              <option value="">-- Select Category --</option>
              <option value="Salaries & Wages">Salaries & Wages</option>
              <option value="Utilities">Utilities (Electricity, Water, Internet)</option>
              <option value="Office Supplies">Office & Teaching Supplies</option>
              <option value="Maintenance & Repairs">Maintenance & Repairs</option>
              <option value="Transport & Fuel">Transport & Fuel</option>
              <option value="Learning Resources">Books & Learning Materials</option>
              <option value="Security & Cleaning">Security & Cleaning Services</option>
              <option value="Other">Other Expenses</option>
            </select>
          </div>

          <div>
            <label className="form-lable">Amount (KSh) *</label>
            <input type="number" name="amount" className="milk-input w-full" value={formData.amount} onChange={handleChange} placeholder="0.00" required />
          </div>

          <div>
            <label className="form-lable">Date *</label>
            <input type="date" name="date" className="milk-input w-full" value={formData.date} onChange={handleChange} required />
          </div>

          <div>
            <label className="form-lable">Supplier / Vendor</label>
            <input type="text" name="vendor" className="milk-input w-full" value={formData.vendor} onChange={handleChange} placeholder="Name of supplier or service provider" />
          </div>

          <div className="md:col-span-2">
            <label className="form-lable">Description</label>
            <textarea name="description" className="milk-input w-full" value={formData.description} onChange={handleChange} placeholder="Brief details about this expense..." rows={3} />
          </div>

          <div className="md:col-span-2">
            <label className="form-lable">Upload Receipt / Invoice</label>
            <input type="file" name="receipt_file" onChange={handleChange} className="w-full text-sm text-gray-600 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="milk-btn px-8" disabled={submitting}>
              {submitting && <ButtonSpinner />} {submitting ? "Saving..." : "✅ Save Expense"}
            </button>
          </div>
        </form>
      </div>

      {/* --- Search & Filter --- */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Expense Records</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="form-lable">Search Description/Vendor</label>
            <input type="text" className="milk-input w-full" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search..." />
          </div>
          <div>
            <label className="form-lable">Filter Category</label>
            <select className="milk-input w-full" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Salaries & Wages">Salaries & Wages</option>
              <option value="Utilities">Utilities</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Maintenance & Repairs">Maintenance & Repairs</option>
              <option value="Transport & Fuel">Transport & Fuel</option>
              <option value="Learning Resources">Learning Resources</option>
              <option value="Security & Cleaning">Security & Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div>
              <label className="form-lable">From</label>
              <input type="date" className="milk-input" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="form-lable">To</label>
              <input type="date" className="milk-input" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">Total Expenses: <strong>KSh {totalExpense.toLocaleString()}</strong> — Showing {filteredExpenses.length} records</p>
        </div>
      </div>

      {/* --- Expense List Table --- */}
      <div className="card overflow-x-auto">
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No expense records found matching your filters.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border-b">Date</th>
                <th className="p-3 text-left border-b">Category</th>
                <th className="p-3 text-left border-b">Description</th>
                <th className="p-3 text-left border-b">Vendor</th>
                <th className="p-3 text-left border-b">Amount</th>
                <th className="p-3 text-left border-b">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="p-3 border-b font-medium">{exp.category}</td>
                  <td className="p-3 border-b">{exp.description || "—"}</td>
                  <td className="p-3 border-b">{exp.vendor || "—"}</td>
                  <td className="p-3 border-b font-semibold text-red-600">KSh {Number(exp.amount).toLocaleString()}</td>
                  <td className="p-3 border-b">
                    {exp.receipt_file ? <a href={exp.receipt_file} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">View Receipt</a> : <span className="text-gray-400">None</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseManager;