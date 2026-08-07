import React, { useEffect, useState } from "react";
import api from "../api/api";

const StudentResults = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get("students/");
      setStudents(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (studentId) => {
    setLoadingResults(true);
    try {
      const res = await api.get(`students/${studentId}/performance-summary/`);
      setResults(res.data.recentResults || []);
    } catch (err) {
      console.error("Failed to load student results:", err);
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleStudentChange = (e) => {
    const id = e.target.value;
    setSelectedStudent(id);
    if (id) loadResults(id);
    else setResults([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
          Student Results
        </h1>
        <p className="text-gray-500 mt-2">
          View individual student assessment & exam results
        </p>
      </div>

      {/* Student Selector */}
      <div className="card">
        <label className="form-lable">Select Student</label>
        <select
          className="milk-input max-w-md"
          value={selectedStudent}
          onChange={handleStudentChange}
        >
          <option value="">-- Choose a student --</option>
          {students.map((stu) => (
            <option key={stu.id} value={stu.id}>
              {stu.first_name} {stu.last_name} {stu.admission_number ? `(${stu.admission_number})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Results Table */}
      <div className="card overflow-x-auto">
        {!selectedStudent ? (
          <div className="text-center text-gray-500 py-10">
            Select a student above to view their results.
          </div>
        ) : loadingResults ? (
          <div className="text-center py-10 text-gray-500">
            Loading results...
          </div>
        ) : results.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No results recorded for this student yet.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-green-200">
                <th className="py-3 px-3 text-green-700 font-semibold">Subject</th>
                <th className="py-3 px-3 text-green-700 font-semibold">Assessment/Exam</th>
                <th className="py-3 px-3 text-green-700 font-semibold">Score</th>
                <th className="py-3 px-3 text-green-700 font-semibold">Grade</th>
                <th className="py-3 px-3 text-green-700 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-green-50">
                  <td className="py-3 px-3 font-medium">{res.subject}</td>
                  <td className="py-3 px-3">{res.exam_name}</td>
                  <td className="py-3 px-3 font-semibold">{res.score}/{res.total}</td>
                  <td className="py-3 px-3">{res.grade}</td>
                  <td className="py-3 px-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      res.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {res.approved ? "Approved" : "Pending"}
                    </span>
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

export default StudentResults;
