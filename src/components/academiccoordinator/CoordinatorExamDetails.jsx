import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

const CoordinatorExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [resultStats, setResultStats] = useState({ submitted:0, approved:0, pending:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExamDetails = async () => {
      try {
        const [examRes, subjRes, statsRes] = await Promise.all([
          api.get(`exams/${id}/`),
          api.get(`exams/${id}/subjects/`),
          api.get(`exams/${id}/result-stats/`)
        ]);
        setExam(examRes.data);
        setSubjects(subjRes.data.results || subjRes.data);
        setResultStats(statsRes.data);
      } catch (err) {
        console.error("Failed to load exam details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadExamDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading exam details...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="card text-center py-10">
        <p className="text-red-500 text-lg">Exam not found.</p>
        <button onClick={() => navigate(-1)} className="milk-btn mt-4">← Back to Exams</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Back */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
            {exam.name}
          </h1>
          <p className="text-gray-500 mt-2">
            {exam.term} Term • {exam.year} • {exam.start_date} — {exam.end_date || "Ongoing"}
          </p>
        </div>
        <button onClick={() => navigate(-1)} className="milk-btn w-fit">
          ← Back to Exams
        </button>
      </div>

      {/* Status & Result Overview — stat-card */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Status</p>
          <p className={`stat-value mt-1 ${
            exam.status === "completed" ? "text-green-600" :
            exam.status === "active" ? "text-orange-500" : "text-blue-600"
          }`}>
            {exam.status?.toUpperCase() || "UNKNOWN"}
          </p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Results Submitted</p>
          <p className="stat-value mt-1">{resultStats.submitted}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Pending Approval</p>
          <p className="stat-value mt-1">{resultStats.pending}</p>
        </div>
      </div>

      {/* Exam Subjects List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Exam Subjects & Schedules</h2>
        {subjects.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No subjects added to this exam yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-2 text-gray-600">#</th>
                  <th className="py-3 px-2 text-gray-600">Subject</th>
                  <th className="py-3 px-2 text-gray-600">Date</th>
                  <th className="py-3 px-2 text-gray-600">Time</th>
                  <th className="py-3 px-2 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj, idx) => (
                  <tr key={subj.id} className="border-b border-gray-100 hover:bg-green-50">
                    <td className="py-3 px-2">{idx+1}</td>
                    <td className="py-3 px-2 font-medium">{subj.subject_name}</td>
                    <td className="py-3 px-2">{subj.exam_date || "—"}</td>
                    <td className="py-3 px-2">{subj.start_time || "—"} to {subj.end_time || "—"}</td>
                    <td className="py-3 px-2">
                      <span className={`font-medium ${subj.completed ? "text-green-600" : "text-orange-500"}`}>
                        {subj.completed ? "Done" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-3">Review Results</h3>
          <p className="text-gray-500 mb-4">View, verify and approve marks submitted for this exam.</p>
          <button onClick={() => navigate(`/academic-coordinator/results?exam=${exam.id}`)} className="milk-btn w-full">
            View Exam Results
          </button>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-3">Generate Report</h3>
          <p className="text-gray-500 mb-4">Download performance analysis & summary report for this exam.</p>
          <button className="milk-btn w-full">
            Generate Exam Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorExamDetails;