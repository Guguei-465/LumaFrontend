import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const Attendance = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    classroom: "",
    date: "",
    status: "",
  });

  useEffect(() => {
    loadRecords();

    if (studentId) {
      loadStudent();
    }
  }, [filters, studentId]);

  const loadStudent = async () => {
    try {
      const res = await api.get(`students/${studentId}/`);
      setStudent(res.data);
    } catch (err) {
      console.error("Failed to load student:", err);
    }
  };

  const loadRecords = async () => {
    setLoading(true);

    try {
      const params = {};

      if (filters.classroom) {
        params.classroom = filters.classroom;
      }

      if (filters.date) {
        params.date = filters.date;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      // Important:
      // When viewing a specific student, send student ID.
      if (studentId) {
        params.student = studentId;
      }

      const res = await api.get("attendance/", { params });

      setAttendance(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load attendance:", err);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p>Loading attendance records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>

          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">

            {student
              ? `${student.first_name} ${student.last_name}'s Attendance`
              : "Attendance Overview"}

          </h1>

          <p className="text-gray-500 mt-2">

            {student
              ? `Attendance records for admission number ${
                  student.admission_number || "—"
                }`
              : "Review and filter attendance records across the school"}

          </p>

        </div>

        <div className="flex flex-wrap gap-2">

          {student && (
            <button
              onClick={() =>
                navigate(
                  `/academic-coordinator/students/${student.id}`
                )
              }
              className="milk-btn"
            >
              ← Student Profile
            </button>
          )}

          <button
            onClick={() =>
              navigate("/academic-coordinator/dashboard")
            }
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Dashboard
          </button>

        </div>

      </div>


      {/* =====================================================
          STUDENT SUMMARY
      ===================================================== */}
      {student && (

        <div className="stat-card py-5">

          <div className="grid sm:grid-cols-3 gap-5">

            <div>
              <p className="text-gray-500 text-sm">
                Student
              </p>

              <p className="font-semibold text-gray-800">
                {student.first_name} {student.last_name}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Admission Number
              </p>

              <p className="font-semibold text-gray-800">
                {student.admission_number || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Current Class
              </p>

              <p className="font-semibold text-gray-800">
                {student.current_class?.name || "Unassigned"}

                {student.current_class?.stream &&
                  ` - ${student.current_class.stream}`}
              </p>
            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          FILTERS
      ===================================================== */}
      <div className="card grid md:grid-cols-3 gap-4">

        <div>

          <label className="form-label">
            Filter by Class ID
          </label>

          <input
            type="number"
            className="milk-input"
            placeholder="e.g. 3"
            value={filters.classroom}
            onChange={(e) =>
              setFilters({
                ...filters,
                classroom: e.target.value,
              })
            }
          />

        </div>

        <div>

          <label className="form-label">
            Filter by Date
          </label>

          <input
            type="date"
            className="milk-input"
            value={filters.date}
            onChange={(e) =>
              setFilters({
                ...filters,
                date: e.target.value,
              })
            }
          />

        </div>

        <div>

          <label className="form-label">
            Filter by Status
          </label>

          <select
            className="milk-input"
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value,
              })
            }
          >

            <option value="">
              All Status
            </option>

            <option value="P">
              Present
            </option>

            <option value="A">
              Absent
            </option>

            <option value="L">
              Late
            </option>

            <option value="E">
              Excused
            </option>

          </select>

        </div>

      </div>


      {/* =====================================================
          ATTENDANCE TABLE
      ===================================================== */}
      <div className="card overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b-2">

              <th className="text-left p-3">
                Admission No
              </th>

              <th className="text-left p-3">
                Student Name
              </th>

              <th className="text-left p-3">
                Class
              </th>

              <th className="text-left p-3">
                Date
              </th>

              <th className="text-left p-3">
                Status
              </th>

              <th className="text-left p-3">
                Remarks
              </th>

            </tr>

          </thead>

          <tbody>

            {attendance.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500"
                >
                  No attendance records found.
                </td>

              </tr>

            ) : (

              attendance.map((record) => (

                <tr
                  key={record.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {record.student_adm_no || "—"}
                  </td>

                  <td className="p-3">
                    {record.student_name || "—"}
                  </td>

                  <td className="p-3">
                    {record.class_name || "—"}
                  </td>

                  <td className="p-3">
                    {record.date || "—"}
                  </td>

                  <td className="p-3 font-medium">

                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${
                        record.status === "P"
                          ? "bg-green-600"
                          : record.status === "A"
                          ? "bg-red-600"
                          : record.status === "L"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {record.status_display ||
                        record.status ||
                        "Unknown"}
                    </span>

                  </td>

                  <td className="p-3">
                    {record.remarks || "—"}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Attendance;