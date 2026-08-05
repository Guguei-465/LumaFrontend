import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

// Reusable Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const ParentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/dashboard/parent/");
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Failed to load dashboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <Spinner />;

  if (error || !dashboard)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error || "Dashboard data unavailable."}
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-green-800">Parent Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome back, <span className="font-semibold text-gray-700">{dashboard.parent_name}</span>.
          Stay updated with your children's education.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl shadow-sm border-t-4 border-green-500 p-6 hover:shadow-md transition-all duration-200">
          <p className="text-sm text-gray-500">Total Children</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{dashboard.children_count}</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-4 border-blue-500 p-6 hover:shadow-md transition-all duration-200">
          <p className="text-sm text-gray-500">Overall Attendance</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{dashboard.overall_attendance}%</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-4 border-amber-500 p-6 hover:shadow-md transition-all duration-200">
          <p className="text-sm text-gray-500">Unread Notifications</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{dashboard.unread_notifications}</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-4 border-red-500 p-6 hover:shadow-md transition-all duration-200">
          <p className="text-sm text-gray-500">Outstanding Fees</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            KES {Number(dashboard.total_fee_balance).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Announcements</h2>

          {dashboard.announcements?.length === 0 || !dashboard.announcements ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-400">No announcements available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.announcements.map((item) => (
                <div
                  key={item.id}
                  className="border-l-4 border-green-500 bg-gray-50 rounded-lg p-4 transition hover:bg-gray-100"
                >
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-3">Posted by {item.created_by || "School Admin"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;