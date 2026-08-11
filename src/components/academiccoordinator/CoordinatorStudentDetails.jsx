import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const CoordinatorStudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState({
    average: 0,
    grade: "",
    recentResults: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const [stuRes, perfRes] = await Promise.all([
          api.get(`students/${id}/`),
          api.get(`students/${id}/performance-summary/`),
        ]);

        setStudent(stuRes.data);
        setPerformance({
          average: perfRes.data.average || 0,
          grade: perfRes.data.grade || "",
          recentResults: perfRes.data.recentResults || [],
        });
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
        <p className="text-lg text-gray-500">
          Loading student profile...
        </p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="card text-center py-10">
        <p className="text-red-500 text-lg">
          Student record not found.
        </p>

        <button
          onClick={() =>
            navigate("/academic-coordinator/students")
          }
          className="milk-btn mt-4"
        >
          ← Back to Students
        </button>
      </div>
    );
  }

  const studentName = `${student.first_name} ${student.last_name}`;

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
            {studentName}
          </h1>

          <p className="text-gray-500 mt-2">
            Admission No:{" "}
            {student.admission_number || "Not Assigned"}
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/academic-coordinator/students")
          }
          className="milk-btn w-fit"
        >
          ← Back to Student List
        </button>
      </div>


      {/* =====================================================
          STUDENT OVERVIEW
      ===================================================== */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">
            Current Class
          </p>

          <p className="stat-value text-lg mt-1">
            {student.current_class?.name || "Unassigned"}

            {student.current_class?.stream &&
              ` - ${student.current_class.stream}`}
          </p>
        </div>

        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">
            Overall Average
          </p>

          <p className="stat-value mt-1">
            {performance.average}%
          </p>
        </div>

        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">
            General Grade
          </p>

          <p className="stat-value mt-1">
            {performance.grade || "—"}
          </p>
        </div>

        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">
            Gender
          </p>

          <p className="stat-value text-lg mt-1">
            {student.gender || "—"}
          </p>
        </div>

      </div>


      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}
      <div className="card">

        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Personal Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-3">

            <p>
              <span className="font-medium text-gray-600">
                Full Name:
              </span>{" "}
              {studentName}
            </p>

            <p>
              <span className="font-medium text-gray-600">
                Admission Number:
              </span>{" "}
              {student.admission_number || "—"}
            </p>

            <p>
              <span className="font-medium text-gray-600">
                Gender:
              </span>{" "}
              {student.gender || "—"}
            </p>

            <p>
              <span className="font-medium text-gray-600">
                Date of Birth:
              </span>{" "}
              {student.date_of_birth || "—"}
            </p>

            <p>
              <span className="font-medium text-gray-600">
                Phone:
              </span>{" "}
              {student.phone_number || "—"}
            </p>

          </div>

          <div className="space-y-3">

            <p>
              <span className="font-medium text-gray-600">
                Parent/Guardian:
              </span>{" "}
              {student.parent_name || "—"}
            </p>

            <p>
              <span className="font-medium text-gray-600">
                Parent Contact:
              </span>{" "}
              {student.parent_contact || "—"}
            </p>

            <p>
              <span className="font-medium text-gray-600">
                Address:
              </span>{" "}
              {student.address || "—"}
            </p>

            <p>
              <span className="font-medium text-gray-600">
                Enrollment Date:
              </span>{" "}
              {student.enrollment_date || "—"}
            </p>

          </div>

        </div>
      </div>


      {/* =====================================================
          ACADEMIC RESULTS
      ===================================================== */}
      <div className="card">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Assessment Results
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Latest academic results for {studentName}
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                `/academic-coordinator/student-results/${id}`
              )
            }
            className="milk-btn w-fit"
          >
            View All Results
          </button>

        </div>

        {performance.recentResults.length === 0 ? (

          <p className="text-gray-500 text-center py-6">
            No recent results recorded yet.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-200">

                  <th className="py-3 px-2 text-gray-600">
                    Subject
                  </th>

                  <th className="py-3 px-2 text-gray-600">
                    Assessment/Exam
                  </th>

                  <th className="py-3 px-2 text-gray-600">
                    Score
                  </th>

                  <th className="py-3 px-2 text-gray-600">
                    Grade
                  </th>

                  <th className="py-3 px-2 text-gray-600">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {performance.recentResults.map((res, idx) => (

                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-green-50"
                  >

                    <td className="py-3 px-2">
                      {res.subject}
                    </td>

                    <td className="py-3 px-2">
                      {res.exam_name}
                    </td>

                    <td className="py-3 px-2 font-semibold">
                      {res.score}/{res.total}
                    </td>

                    <td className="py-3 px-2 font-medium">
                      {res.grade}
                    </td>

                    <td className="py-3 px-2">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          res.approved
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-600"
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

          </div>

        )}

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}
      <div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Student Academic Actions
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* RESULTS */}
          <div className="card">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-11 h-11 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <i className="bi bi-journal-check text-xl"></i>
              </div>

              <h3 className="font-semibold text-lg">
                Academic Results
              </h3>

            </div>

            <p className="text-gray-500 mb-4">
              View all assessments, examinations, scores,
              grades and approval status.
            </p>

            <button
              onClick={() =>
                navigate(
                  `/academic-coordinator/student-results/${id}`
                )
              }
              className="milk-btn w-full"
            >
              View Results
            </button>

          </div>


          {/* ATTENDANCE */}
          <div className="card">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <i className="bi bi-calendar-check text-xl"></i>
              </div>

              <h3 className="font-semibold text-lg">
                Attendance
              </h3>

            </div>

            <p className="text-gray-500 mb-4">
              Review this student's attendance records,
              present, absent, late and excused days.
            </p>

            <button
              onClick={() =>
                navigate(
                  `/academic-coordinator/attendance/student/${id}`
                )
              }
              className="milk-btn w-full"
            >
              View Attendance
            </button>

          </div>


          {/* REPORT */}
          <div className="card">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-11 h-11 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <i className="bi bi-file-earmark-pdf text-xl"></i>
              </div>

              <h3 className="font-semibold text-lg">
                Academic Report
              </h3>

            </div>

            <p className="text-gray-500 mb-4">
              Generate a complete academic report containing
              performance and student progress.
            </p>

            <button
              onClick={() =>
                navigate(
                  `/academic-coordinator/reports/student-progress/${id}`
                )
              }
              className="milk-btn w-full"
            >
              Generate Report
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM NAVIGATION
      ===================================================== */}
      <div className="flex flex-wrap gap-3 pt-2">

        <button
          onClick={() =>
            navigate("/academic-coordinator/students")
          }
          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          ← Back to Students
        </button>

        <button
          onClick={() =>
            navigate("/academic-coordinator/dashboard")
          }
          className="px-5 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition"
        >
          Dashboard
        </button>

      </div>

    </div>
  );
};

export default CoordinatorStudentDetails;
