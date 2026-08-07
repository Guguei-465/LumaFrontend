import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

const CoordinatorStudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState({ average: 0, grade: "", recentResults: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const [stuRes, perfRes] = await Promise.all([
          api.get(`students/${id}/`),
          api.get(`students/${id}/performance-summary/`)
        ]);
        setStudent(stuRes.data);
        setPerformance(perfRes.data);
      } catch (err) {
        console.error("Failed to load student details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading student profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="card text-center py-10">
        <p className="text-red-500 text-lg">Student record not found.</p>
        <button onClick={() => navigate(-1)} className="milk-btn mt-4">← Back to Students</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Back */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
            {student.first_name} {student.last_name}
          </h1>
          <p className="text-gray-500 mt-2">Admission No: {student.admission_number || "Not Assigned"}</p>
        </div>
        <button onClick={() => navigate(-1)} className="milk-btn w-fit">
          ← Back to Student List
        </button>
      </div>

      {/* Key Overview Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Current Class</p>
          <p className="stat-value text-lg mt-1">
            {student.current_class?.name || "Unassigned"}
            {student.current_class?.stream && ` - ${student.current_class.stream}`}
          </p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Overall Average</p>
          <p className="stat-value mt-1">{performance.average}%</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">General Grade</p>
          <p className="stat-value mt-1">{performance.grade || "—"}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p><span className="font-medium text-gray-600">Full Name:</span> {student.first_name} {student.last_name}</p>
            <p><span className="font-medium text-gray-600">Gender:</span> {student.gender || "—"}</p>
            <p><span className="font-medium text-gray-600">Date of Birth:</span> {student.date_of_birth || "—"}</p>
            <p><span className="font-medium text-gray-600">Phone:</span> {student.phone_number || "—"}</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium text-gray-600">Parent/Guardian:</span> {student.parent_name || "—"}</p>
            <p><span className="font-medium text-gray-600">Parent Contact:</span> {student.parent_contact || "—"}</p>
            <p><span className="font-medium text-gray-600">Address:</span> {student.address || "—"}</p>
            <p><span className="font-medium text-gray-600">Enrollment Date:</span> {student.enrollment_date || "—"}</p>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Assessment Results</h2>
        {performance.recentResults.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent results recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-2 text-gray-600">Subject</th>
                  <th className="py-3 px-2 text-gray-600">Assessment/Exam</th>
                  <th className="py-3 px-2 text-gray-600">Score</th>
                  <th className="py-3 px-2 text-gray-600">Grade</th>
                  <th className="py-3 px-2 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {performance.recentResults.map((res, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-green-50">
                    <td className="py-3 px-2">{res.subject}</td>
                    <td className="py-3 px-2">{res.exam_name}</td>
                    <td className="py-3 px-2">{res.score}/{res.total}</td>
                    <td className="py-3 px-2 font-medium">{res.grade}</td>
                    <td className="py-3 px-2">
                      <span className={`font-medium ${res.approved ? "text-green-600" : "text-orange-500"}`}>
                        {res.approved ? "Approved" : "Pending"}
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
          <h3 className="font-semibold text-lg mb-3">Full Academic Report</h3>
          <p className="text-gray-500 mb-4">Download complete academic history, term performance & progress report.</p>
          <button className="milk-btn w-full">Generate Student Report</button>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-3">View Attendance</h3>
          <p className="text-gray-500 mb-4">Check attendance records, days present/absent & term attendance rate.</p>
          <button className="milk-btn w-full">View Attendance Record</button>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorStudentDetails;