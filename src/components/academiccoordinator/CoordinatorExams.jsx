import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CoordinatorExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const res = await api.get("exams/");
      setExams(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load exams:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter by exam name/term/year
  const filteredExams = exams.filter((exam) =>
    exam.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.term?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(exam.year).includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading exams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
          Manage Exams
        </h1>
        <p className="text-gray-500 mt-2">
          View scheduled exams, terms, dates and status
        </p>
      </div>

      {/* Search Bar */}
      <div className="card">
        <input
          type="text"
          placeholder="Search by exam name, term or year..."
          className="milk-input max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Exams Stats Summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Total Exams</p>
          <p className="stat-value">{exams.length}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Upcoming / Active</p>
          <p className="stat-value">{exams.filter(e => e.status === "upcoming" || e.status === "active").length}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Completed</p>
          <p className="stat-value">{exams.filter(e => e.status === "completed").length}</p>
        </div>
      </div>

      {/* Exams List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExams.length === 0 ? (
          <div className="card col-span-full text-center text-gray-500 py-10">
            No exams found.
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div key={exam.id} className="card hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {exam.name}
              </h3>
              <div className="space-y-2 mb-4 text-gray-600">
                <p><span className="font-medium">Term:</span> {exam.term}</p>
                <p><span className="font-medium">Year:</span> {exam.year}</p>
                <p><span className="font-medium">Start Date:</span> {exam.start_date || "Not set"}</p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-1 font-medium ${
                    exam.status === "completed" ? "text-green-600" :
                    exam.status === "active" ? "text-orange-500" : "text-blue-600"
                  }`}>
                    {exam.status?.toUpperCase() || "Unknown"}
                  </span>
                </p>
              </div>
              <button
                onClick={() => navigate(`/academic-coordinator/exams/${exam.id}`)}
                className="milk-btn w-full"
              >
                View Exam Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CoordinatorExams;