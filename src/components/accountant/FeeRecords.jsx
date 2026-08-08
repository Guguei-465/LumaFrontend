import React, { useEffect, useState, useCallback } from "react";
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

const FeeRecords = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all / paid / partial / pending
  const [filterTerm, setFilterTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");

  // --- Fetch All Payments ---
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("fees/payments/");
      console.log("Fetched payments:", res.data);
      setPayments(res.data || []);
      setFilteredPayments(res.data || []);
    } catch (err) {
      console.error("Failed to load payments:", err);
      setError("Could not load payment records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // --- Search + Filter Logic ---
  useEffect(() => {
    let result = [...payments];

    // Search: student name / receipt number / adm number
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.student_name?.toLowerCase().includes(term) ||
        p.receipt_number?.toLowerCase().includes(term) ||
        p.admission_number?.toLowerCase().includes(term)
      );
    }

    // Filter by payment status
    if (filterStatus !== "all") {
      result = result.filter(p => p.status === filterStatus);
    }

    // Filter by term
    if (filterTerm) {
      result = result.filter(p => p.term === filterTerm);
    }

    // Filter by class
    if (filterClass) {
      result = result.filter(p => p.class_name === filterClass);
    }

    setFilteredPayments(result);
  }, [payments, searchTerm, filterStatus, filterTerm, filterClass]);

  // --- Helper for status badge ---
  const StatusBadge = ({ status }) => {
    const styles = {
      paid: "bg-green-100 text-green-700",
      partial: "bg-yellow-100 text-yellow-700",
      pending: "bg-red-100 text-red-700"
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || "bg-gray-100"}`}>
        {status?.toUpperCase() || "—"}
      </span>
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Fee Payment Records</h1>
          <p className="text-gray-500 mt-1 text-sm">View, search and filter all student fee payments</p>
        </div>
        <button onClick={fetchPayments} className="milk-btn whitespace-nowrap">
          🔄 Refresh List
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="card bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}

      {/* --- Search & Filter Bar --- */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="form-lable">Search</label>
            <input
              type="text"
              placeholder="Search by student name, receipt or admission number..."
              className="milk-input w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="form-lable">Payment Status</label>
            <select className="milk-input w-full" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Term Filter */}
          <div>
            <label className="form-lable">Term</label>
            <select className="milk-input w-full" value={filterTerm} onChange={(e) => setFilterTerm(e.target.value)}>
              <option value="">All Terms</option>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class Filter */}
          <div>
            <label className="form-lable">Class / Grade</label>
            <input
              type="text"
              placeholder="Filter by class..."
              className="milk-input w-full"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              Showing <strong>{filteredPayments.length}</strong> of {payments.length} records
            </p>
          </div>
        </div>
      </div>

      {/* --- Payments Table --- */}
      <div className="card overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Payment List</h2>

        {filteredPayments.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No payment records found matching your filters.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border-b">Receipt No.</th>
                <th className="p-3 text-left border-b">Student Name</th>
                <th className="p-3 text-left border-b">Adm No.</th>
                <th className="p-3 text-left border-b">Class</th>
                <th className="p-3 text-left border-b">Amount Paid</th>
                <th className="p-3 text-left border-b">Total Expected</th>
                <th className="p-3 text-left border-b">Status</th>
                <th className="p-3 text-left border-b">Date</th>
                <th className="p-3 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{payment.receipt_number || "—"}</td>
                  <td className="p-3 border-b font-medium">{payment.student_name || "—"}</td>
                  <td className="p-3 border-b">{payment.admission_number || "—"}</td>
                  <td className="p-3 border-b">{payment.class_name || "—"}</td>
                  <td className="p-3 border-b">KSh {Number(payment.amount_paid).toLocaleString()}</td>
                  <td className="p-3 border-b">KSh {Number(payment.total_expected).toLocaleString()}</td>
                  <td className="p-3 border-b"><StatusBadge status={payment.status} /></td>
                  <td className="p-3 border-b text-sm">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="p-3 border-b">
                    <button className="text-blue-600 text-sm font-medium hover:underline">View / Print</button>
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

export default FeeRecords;