import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AcademicCoClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await api.get("classes/");
      setClasses(res.data.results || res.data); // support paginated/normal response
    } catch (err) {
      console.error("Failed to load classes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter classes by name/stream
  const filteredClasses = classes.filter((cls) =>
    cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.stream?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
            Manage Classes
          </h1>
          <p className="text-gray-500 mt-2">
            View, monitor and manage all school classes
          </p>
        </div>
      </div>

      {/* Search Bar — uses milk-input */}
      <div className="card">
        <input
          type="text"
          placeholder="Search by class name or stream..."
          className="milk-input max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Classes List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.length === 0 ? (
          <div className="card col-span-full text-center text-gray-500 py-10">
            No classes found.
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.id} className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {cls.name} {cls.stream && `- ${cls.stream}`}
              </h3>
              <div className="space-y-2 mb-4 text-gray-600">
                <p><span className="font-medium">Class Teacher:</span> {cls.class_teacher || "Not assigned"}</p>
                <p><span className="font-medium">Total Students:</span> {cls.total_students || 0}</p>
                <p><span className="font-medium">Capacity:</span> {cls.capacity || "Unlimited"}</p>
              </div>
              <button
                onClick={() => navigate(`/academic-coordinator/classes/${cls.id}`)}
                className="milk-btn w-full"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AcademicCoClasses;