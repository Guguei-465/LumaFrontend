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

const PendingFees = () => {
  const [pendingList, setPendingList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all / partial / overdue

  // --- Fetch students with pending/overdue fees ---
  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("fees/pending-fees/");
      console.log("Pending fees data:", res.data);
      setPendingList(res.data || []);
      setFilteredList(res.data || []);
    } catch (err) {
      console.error("Failed to load pending fees:", err);
      setError("Could not load pending fee records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  // --- Search & Filter Logic ---
  useEffect(() => {
    let result = [...pendingList];

    // Search by student name / admission number
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.student_name?.toLowerCase().includes(term) ||
        s.admission_number?.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (filterStatus === "partial") {
      result = result.filter(s => s.amount_paid > 0 && s.balance > 0);
    }
    if (filterStatus === "overdue") {
      result = result.filter(s => s.is_overdue === true);
    }

    // Filter by term
    if (filterTerm) {
      result = result.filter(s => s.term === filterTerm);
    }

    // Filter by class
    if (filterClass.trim()) {
      result = result.filter(s => s.class_name?.toLowerCase().includes(filterClass.toLowerCase()));
    }

    setFilteredList(result);
  }, [pendingList, searchTerm, filterStatus, filterTerm, filterClass]);

  // --- Status Badge ---
  const StatusBadge = ({ isOverdue, hasPartial }) => {
    if (isOverdue) return <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">OVERDUE</span>;
    if (hasPartial) return <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">PARTIAL</span>;
    return <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700">UNPAID</span>;
  };

  // --- Send Reminder Handler ---
  const sendReminder = async (studentId) => {
    try {
      setError("");
      await api.post(`fees/send-reminder/${studentId}/`);
      alert("Payment reminder sent successfully!");
    } catch (err) {
      setError("Failed to send reminder. Try again.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Pending & Overdue Fees</h1>
          <p className="text-gray-500 mt-1 text-sm">List of students with outstanding fee balances</p>
        </div>
        <button onClick={fetchPending} className="milk-btn whitespace-nowrap">
          🔄 Refresh List
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="card bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}

      {/* --- Search & Filter Controls --- */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="form-lable">Search Student</label>
            <input
              type="text"
              placeholder="Name or Admission Number..."
              className="milk-input w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="form-lable">Status</label>
            <select className="milk-input w-full" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Pending</option>
              <option value="partial">Partially Paid</option>
              <option value="overdue">Overdue Only</option>
            </select>
          </div>
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
            <p className="text-sm text-gray-600">Showing <strong>{filteredList.length}</strong> students with pending fees</p>
          </div>
        </div>
      </div>

      {/* --- Summary Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-orange-50 border-l-4 border-orange-500">
          <p className="text-sm text-gray-600">Total Outstanding Amount</p>
          <p className="text-xl font-bold text-orange-700 mt-1">
            KSh {filteredList.reduce((sum, item) => sum + Number(item.balance), 0).toLocaleString()}
          </p>
        </div>
        <div className="card p-4 bg-yellow-50 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Partially Paid Students</p>
          <p className="text-xl font-bold text-yellow-700 mt-1">
            {filteredList.filter(i => i.amount_paid > 0 && i.balance > 0).length}
          </p>
        </div>
        <div className="card p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Overdue / Arrears</p>
          <p className="text-xl font-bold text-red-700 mt-1">
            {filteredList.filter(i => i.is_overdue).length} students
          </p>
        </div>
      </div>

      {/* --- Pending Fees Table --- */}
      <div className="card overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Student Outstanding List</h2>
        {filteredList.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No pending or overdue fee records found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border-b">Student Name</th>
                <th className="p-3 text-left border-b">Adm No.</th>
                <th className="p-3 text-left border-b">Class</th>
                <th className="p-3 text-left border-b">Total Expected</th>
                <th className="p-3 text-left border-b">Amount Paid</th>
                <th className="p-3 text-left border-b">Balance Due</th>
                <th className="p-3 text-left border-b">Status</th>
                <th className="p-3 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b font-medium">{item.student_name}</td>
                  <td className="p-3 border-b">{item.admission_number}</td>
                  <td className="p-3 border-b">{item.class_name}</td>
                  <td className="p-3 border-b">KSh {Number(item.total_expected).toLocaleString()}</td>
                  <td className="p-3 border-b text-green-600">KSh {Number(item.amount_paid).toLocaleString()}</td>
                  <td className="p-3 border-b font-semibold text-red-600">KSh {Number(item.balance).toLocaleString()}</td>
                  <td className="p-3 border-b">
                    <StatusBadge isOverdue={item.is_overdue} hasPartial={item.amount_paid > 0} />
                  </td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => sendReminder(item.student_id)}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Send Reminder
                    </button>
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

export default PendingFees;