import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    admin_count: 0,
    teacher_count: 0,
    student_count: 0,
    parent_count: 0,
    staff_count: 0,
    active_users: 0,
    inactive_users: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch aggregated stats from Django backend
const fetchStats = async () => {
    try {
      const { data } = await api.get("accounts/users/");
      const users = Array.isArray(data) ? data : (data.results || []);
      setStats({
        total_users: users.length,
        admin_count: users.filter(u => (u.role || "").toUpperCase().includes("ADMIN")).length,
        teacher_count: users.filter(u => (u.role || "").toUpperCase() === "TEACHER").length,
        student_count: users.filter(u => (u.role || "").toUpperCase() === "STUDENT").length,
        parent_count: users.filter(u => (u.role || "").toUpperCase() === "PARENT").length,
        staff_count: users.filter(u => (u.role || "").toUpperCase() === "STAFF").length,
        active_users: users.filter(u => u.is_active).length,
        inactive_users: users.filter(u => !u.is_active).length
      });
    } catch (err) {
      toast.error("❌ Failed to load dashboard overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p className="text-lg">Loading admin overview...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Admin Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">System summary & registered users statistics</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="card p-5 bg-blue-50 border-l-4 border-blue-500">
          <p className="text-sm text-blue-700 font-medium">Total Registered Users</p>
          <p className="text-3xl font-bold text-blue-800 mt-1">{stats.total_users}</p>
        </div>
        <div className="card p-5 bg-green-50 border-l-4 border-green-500">
          <p className="text-sm text-green-700 font-medium">Active Accounts</p>
          <p className="text-3xl font-bold text-green-800 mt-1">{stats.active_users}</p>
        </div>
        <div className="card p-5 bg-red-50 border-l-4 border-red-500">
          <p className="text-sm text-red-700 font-medium">Inactive Accounts</p>
          <p className="text-3xl font-bold text-red-800 mt-1">{stats.inactive_users}</p>
        </div>
        <div className="card p-5 bg-teal-50 border-l-4 border-teal-500">
          <p className="text-sm text-teal-700 font-medium">System Administrators</p>
          <p className="text-3xl font-bold text-teal-800 mt-1">{stats.admin_count}</p>
        </div>
      </div>

      {/* Role Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="card p-5 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Teachers</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.teacher_count}</p>
        </div>
        <div className="card p-5 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Students</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.student_count}</p>
        </div>
        <div className="card p-5 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Parents/Guardians</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.parent_count}</p>
        </div>
        <div className="card p-5 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Office Staff</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.staff_count}</p>
        </div>
        <div className="card p-5 shadow-sm col-span-1 sm:col-span-2 lg:col-span-3 bg-gray-50">
          <p className="text-sm text-gray-600 font-medium">Quick Summary</p>
          <p className="text-gray-700 mt-1">
            System has <strong>{stats.total_users}</strong> registered users: <strong>{stats.active_users}</strong> active & <strong>{stats.inactive_users}</strong> inactive across all roles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;