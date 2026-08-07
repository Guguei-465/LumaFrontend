import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CoordinatorTeachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const res = await api.get("teachers/");
      setTeachers(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter by name or staff number
  const filteredTeachers = teachers.filter((tea) =>
    tea.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tea.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tea.staff_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
          Teachers & Staff
        </h1>
        <p className="text-gray-500 mt-2">
          View teaching staff, assigned classes & subjects
        </p>
      </div>

      {/* Search Bar */}
      <div className="card">
        <input
          type="text"
          placeholder="Search by name or staff number..."
          className="milk-input max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Overview Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Total Teachers</p>
          <p className="stat-value">{teachers.length}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Class Teachers</p>
          <p className="stat-value">{teachers.filter(t => t.is_class_teacher).length}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Subject Specialists</p>
          <p className="stat-value">{teachers.filter(t => t.subjects_taught?.length > 0).length}</p>
        </div>
      </div>

      {/* Teachers List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.length === 0 ? (
          <div className="card col-span-full text-center text-gray-500 py-10">
            No teachers found.
          </div>
        ) : (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {teacher.first_name} {teacher.last_name}
              </h3>
              <div className="space-y-2 mb-4 text-gray-600">
                <p><span className="font-medium">Staff No:</span> {teacher.staff_number || "—"}</p>
                <p><span className="font-medium">Role:</span> {teacher.is_class_teacher ? "Class Teacher" : "Subject Teacher"}</p>
                <p><span className="font-medium">Assigned Classes:</span> {teacher.classes_taught?.length || 0}</p>
                <p><span className="font-medium">Subjects:</span> {teacher.subjects_taught?.join(", ") || "Not assigned"}</p>
              </div>
              <button
                onClick={() => navigate(`/academic-coordinator/teachers/${teacher.id}`)}
                className="milk-btn w-full"
              >
                View Full Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CoordinatorTeachers;