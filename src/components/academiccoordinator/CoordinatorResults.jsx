import React, { useEffect, useState } from "react";
import api from "../api/api";

const CoordinatorResults = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExam, setFilterExam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resRes, examRes, classRes] = await Promise.all([
        api.get("results/"),
        api.get("exams/"),
        api.get("classes/")
      ]);
      setResults(resRes.data.results || resRes.data);
      setExams(examRes.data.results || examRes.data);
      setClasses(classRes.data.results || classRes.data);
    } catch (err) {
      console.error("Failed to load results:", err);
    } finally {
      setLoading(false);
    }
  };

  // Combined filters
  const filteredResults = results.filter((r) => {
    const matchSearch = 
      r.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subject_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchExam = filterExam === "all" || String(r.exam_id) === filterExam;
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchExam && matchStatus;
  });

  // Status action handlers
  const approveResult = async (id) => {
    try {
      await api.patch(`results/${id}/approve/`);
      loadData(); // refresh list
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Could not approve this result!");
    }
  };

  const rejectResult = async (id) => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;
    try {
      await api.patch(`results/${id}/reject/`, { rejection_reason: reason });
      loadData();
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Could not reject this result!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading student results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
          Review & Manage Results
        </h1>
        <p className="text-gray-500 mt-2">
          Verify, approve or correct submitted assessment/exam marks
        </p>
      </div>

      {/* Search & Filter Bar — uses card + milk-input */}
      <div className="card">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="form-lable">Search Student / Subject</label>
            <input
              type="text"
              placeholder="Search by student or subject..."
              className="milk-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="form-lable">Filter by Exam</label>
            <select
              className="milk-input"
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
            >
              <option value="all">All Exams</option>
              {exams.map(ex => <option key={ex.id} value={String(ex.id)}>{ex.name}</option>)}
            </select>
          </div>
          <div>
            <label className="form-lable">Filter by Status</label>
            <select
              className="milk-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats — stat-card */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Pending Review</p>
          <p className="stat-value">{results.filter(r => r.status === "pending").length}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Approved</p>
          <p className="stat-value">{results.filter(r => r.status === "approved").length}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Rejected</p>
          <p className="stat-value">{results.filter(r => r.status === "rejected").length}</p>
        </div>
      </div>

      {/* Results Table — card wrapped */}
      <div className="card overflow-x-auto">
        {filteredResults.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No results match your current filters.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-green-200">
                <th className="py-3 px-3 text-green-700 font-semibold">Student</th>
                <th className="py-3 px-3 text-green-700 font-semibold">Subject</th>
                <th className="py-3 px-3 text-green-700 font-semibold">Exam</th>
                <th className="py-3 px-3 text-green-700 font-semibold">Score</th>
                <th className="py-3 px-3 text-green-700 font-semibold">Status</th>
                <th className="py-3 px-3 text-center text-green-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((res) => (
                <tr key={res.id} className="border-b border-gray-100 hover:bg-green-50">
                  <td className="py-3 px-3 font-medium">{res.student_name}</td>
                  <td className="py-3 px-3">{res.subject_name}</td>
                  <td className="py-3 px-3">{res.exam_name}</td>
                  <td className="py-3 px-3 font-semibold">{res.score} / {res.total_score}</td>
                  <td className="py-3 px-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      res.status === "approved" ? "bg-green-100 text-green-700" :
                      res.status === "pending" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {res.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {res.status === "pending" ? (
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => approveResult(res.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => rejectResult(res.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No action</span>
                    )}
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

export default CoordinatorResults;