import React, { useEffect, useState } from "react";
import api from "../api/api";

// --- Reusable Spinners ---
const Spinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const StatCard = ({ title, value, subText, colorClass }) => (
  <div className={`card p-5 rounded-lg shadow-sm border-l-4 ${colorClass}`}>
    <p className="text-sm text-gray-500 font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
    {subText && <p className="text-xs text-gray-500 mt-2">{subText}</p>}
  </div>
);

const FeesDashboard = () => {
  const [stats, setStats] = useState({
    total_expected: 0,
    total_collected: 0,
    total_pending: 0,
    total_overdue: 0,
    collection_percentage: 0,
    this_month_collected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch Fee Statistics ---
  const fetchFeeStats = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("fees/dashboard-stats/");
      console.log("Fee Dashboard Stats:", res.data);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load fee stats:", err);
      setError("Could not load financial overview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Fees Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Real-time fee collection & financial overview</p>
        </div>
        <button onClick={fetchFeeStats} className="milk-btn whitespace-nowrap">
          🔄 Refresh Data
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="card bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}

      {/* --- Key Statistics Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Expected Fees"
          value={`KSh ${stats.total_expected.toLocaleString()}`}
          colorClass="border-blue-500"
        />
        <StatCard
          title="Total Collected"
          value={`KSh ${stats.total_collected.toLocaleString()}`}
          subText={`${stats.collection_percentage}% of total expected`}
          colorClass="border-green-500"
        />
        <StatCard
          title="Total Pending Fees"
          value={`KSh ${stats.total_pending.toLocaleString()}`}
          colorClass="border-yellow-500"
        />
        <StatCard
          title="Overdue / Arrears"
          value={`KSh ${stats.total_overdue.toLocaleString()}`}
          colorClass="border-red-500"
        />
        <StatCard
          title="This Month Collected"
          value={`KSh ${stats.this_month_collected.toLocaleString()}`}
          colorClass="border-teal-500"
        />
        <StatCard
          title="Collection Rate"
          value={`${stats.collection_percentage}%`}
          colorClass="border-indigo-500"
        />
      </div>

      {/* --- Quick Navigation Cards --- */}
      <div className="card mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border rounded-lg hover:bg-blue-50 text-left transition">
            <span className="font-medium">📋 View All Fee Records</span>
          </button>
          <button className="p-4 border rounded-lg hover:bg-blue-50 text-left transition">
            <span className="font-medium">✍️ Record New Payment</span>
          </button>
          <button className="p-4 border rounded-lg hover:bg-blue-50 text-left transition">
            <span className="font-medium">📉 Generate Financial Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeesDashboard;