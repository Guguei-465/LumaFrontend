import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const StudentResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(id || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [selectedStudentData, setSelectedStudentData] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (id) {
      setSelectedStudent(id);
      loadResults(id);
    }
  }, [id]);

  const loadStudents = async () => {
    try {
      const res = await api.get("students/");

      const data = res.data.results || res.data;

      setStudents(data);

      if (id) {
        const found = data.find(
          (student) => String(student.id) === String(id)
        );

        setSelectedStudentData(found || null);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (studentId) => {
    if (!studentId) return;

    setLoadingResults(true);

    try {
      const res = await api.get(
        `students/${studentId}/performance-summary/`
      );

      setResults(res.data.recentResults || []);

      const found = students.find(
        (student) => String(student.id) === String(studentId)
      );

      if (found) {
        setSelectedStudentData(found);
      }
    } catch (err) {
      console.error("Failed to load student results:", err);
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;

    setSelectedStudent(studentId);

    if (studentId) {
      navigate(
        `/academic-coordinator/student-results/${studentId}`
      );

      loadResults(studentId);
    } else {
      setResults([]);
      setSelectedStudentData(null);

      navigate("/academic-coordinator/student-results");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">
          Loading students...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
            Student Results
          </h1>

          <p className="text-gray-500 mt-2">
            View individual student assessment and examination results
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/academic-coordinator/students")
          }
          className="milk-btn w-fit"
        >
          ← Back to Students
        </button>

      </div>


      {/* Student Selector */}
      <div className="card">

        <label className="form-label">
          Select Student
        </label>

        <select
          className="milk-input max-w-md"
          value={selectedStudent}
          onChange={handleStudentChange}
        >

          <option value="">
            -- Choose a student --
          </option>

          {students.map((stu) => (

            <option
              key={stu.id}
              value={stu.id}
            >
              {stu.first_name} {stu.last_name}

              {stu.admission_number
                ? ` (${stu.admission_number})`
                : ""}
            </option>

          ))}

        </select>

      </div>


      {/* Selected Student */}
      {selectedStudentData && (

        <div className="stat-card py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-gray-500 text-sm">
                Viewing Results For
              </p>

              <h2 className="text-xl font-semibold text-gray-800">
                {selectedStudentData.first_name}{" "}
                {selectedStudentData.last_name}
              </h2>

              <p className="text-gray-500">
                Admission No:{" "}
                {selectedStudentData.admission_number || "—"}
              </p>

            </div>

            <button
              onClick={() =>
                navigate(
                  `/academic-coordinator/students/${selectedStudentData.id}`
                )
              }
              className="milk-btn w-fit"
            >
              View Student Profile
            </button>

          </div>

        </div>

      )}


      {/* Results */}
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

                <th className="py-3 px-3 text-green-700 font-semibold">
                  Subject
                </th>

                <th className="py-3 px-3 text-green-700 font-semibold">
                  Assessment/Exam
                </th>

                <th className="py-3 px-3 text-green-700 font-semibold">
                  Score
                </th>

                <th className="py-3 px-3 text-green-700 font-semibold">
                  Grade
                </th>

                <th className="py-3 px-3 text-green-700 font-semibold">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {results.map((res, idx) => (

                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-green-50"
                >

                  <td className="py-3 px-3 font-medium">
                    {res.subject}
                  </td>

                  <td className="py-3 px-3">
                    {res.exam_name}
                  </td>

                  <td className="py-3 px-3 font-semibold">
                    {res.score}/{res.total}
                  </td>

                  <td className="py-3 px-3">
                    {res.grade}
                  </td>

                  <td className="py-3 px-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        res.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {res.approved
                        ? "Approved"
                        : "Pending"}
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
