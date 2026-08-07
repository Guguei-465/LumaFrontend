import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const MarkAttendanceCoordinator = () => {
  const navigate = useNavigate();

  const [formSettings, setFormSettings] = useState({ classroom: "", date: "" });
  const [students, setStudents] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const statusOptions = [
    { value: "P", label: "Present" },
    { value: "A", label: "Absent" },
    { value: "L", label: "Late" },
    { value: "E", label: "Excused" }
  ];

  // Load students when Coordinator selects class + date
  useEffect(() => {
    if (!formSettings.classroom || !formSettings.date) {
      setStudents([]);
      setAttendanceList([]);
      return;
    }

    const loadClassStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`students/?classroom=${formSettings.classroom}`);
        const classStudents = res.data.results || res.data;

        setStudents(classStudents);
        // Default all to Present
        const initialAttendance = classStudents.map(student => ({
          student: student.id,
          status: "P",
          remarks: "",
          classroom: formSettings.classroom,
          date: formSettings.date
        }));
        setAttendanceList(initialAttendance);

      } catch (err) {
        console.error("Failed to load students:", err);
        setError("Could not load students for this class. Check Class ID.");
      } finally {
        setLoading(false);
      }
    };

    loadClassStudents();
  }, [formSettings.classroom, formSettings.date]);

  const updateStudentAttendance = (studentId, field, value) => {
    setAttendanceList(prev =>
      prev.map(item => item.student === studentId ? { ...item, [field]: value } : item)
    );
  };

  // Quick bulk actions
  const markAllAs = (status) => {
    setAttendanceList(prev => prev.map(item => ({ ...item, status })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attendanceList.length === 0) {
      setError("No students to mark attendance for!");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await Promise.all(
        attendanceList.map(record => api.post("attendance/mark/", record))
      );
      alert("✅ Attendance saved successfully!");
      navigate("/academic-coordinator/attendance");

    } catch (err) {
      console.error("Save failed:", err);
      setError(err.response?.data || "Failed! Some students may already have attendance today.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">Mark Attendance (Coordinator)</h1>
          <p className="text-gray-500">Select any class & date — use for backup/cover</p>
        </div>
        <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Back
        </button>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-100 text-red-700">{error}</div>}

      {/* Select ANY Class + Date — Coordinator has full access */}
      <div className="card grid md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Select Class ID <span className="text-red-500">*</span></label>
          <input
            type="number"
            className="milk-input"
            placeholder="Enter any Class ID"
            value={formSettings.classroom}
            onChange={(e) => setFormSettings({ ...formSettings, classroom: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="form-label">Select Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className="milk-input"
            value={formSettings.date}
            onChange={(e) => setFormSettings({ ...formSettings, date: e.target.value })}
            required
          />
        </div>
      </div>

      {loading && <p className="text-center py-4">Loading students in selected class...</p>}

      {/* Mark Attendance Table */}
      {students.length > 0 && (
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Quick Bulk Buttons */}
          <div className="flex flex-wrap gap-3 pb-4 border-b">
            <span className="font-medium self-center">Quick Mark All:</span>
            <button type="button" onClick={() => markAllAs("P")} className="px-4 py-2 bg-green-600 text-white rounded-lg">All Present</button>
            <button type="button" onClick={() => markAllAs("A")} className="px-4 py-2 bg-red-600 text-white rounded-lg">All Absent</button>
            <button type="button" onClick={() => markAllAs("L")} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">All Late</button>
            <button type="button" onClick={() => markAllAs("E")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">All Excused</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">#</th>
                  <th className="text-left p-3">Adm No</th>
                  <th className="text-left p-3">Student Name</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.id} className="border-b">
                    <td className="p-3">{idx+1}</td>
                    <td className="p-3">{student.admission_number}</td>
                    <td className="p-3">{student.first_name} {student.last_name}</td>
                    <td className="p-3">
                      <select
                        className="milk-input"
                        value={attendanceList.find(i => i.student === student.id)?.status || "P"}
                        onChange={(e) => updateStudentAttendance(student.id, "status", e.target.value)}
                      >
                        {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        className="milk-input"
                        placeholder="Note/Reason"
                        value={attendanceList.find(i => i.student === student.id)?.remarks || ""}
                        onChange={(e) => updateStudentAttendance(student.id, "remarks", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button type="submit" className="milk-btn min-w-[200px]" disabled={submitting}>
              {submitting ? "Saving..." : "💾 Save All Attendance"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MarkAttendanceCoordinator;