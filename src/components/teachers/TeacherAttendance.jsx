import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const ButtonSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
);

const TeacherAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [attendanceDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchMyClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("dashboard/teacher/");
      setClasses(Array.isArray(data?.classes) ? data.classes : []);
    } catch (err) {
      console.error("Classes error:", err);
      setError("Failed to load your classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async (classId) => {
    if (!classId) {
      setStudents([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get(`dashboard/teacher/students/?class_id=${classId}`);
      const studentList = Array.isArray(data) ? data : [];
      // Default all to Present initially
      setStudents(studentList.map(s => ({ ...s, status: "present" })));
    } catch (err) {
      console.error("Students error:", err);
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  const markStatus = (studentId, status) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, status } : s
    ));
  };

  const saveAttendance = async () => {
    if (!selectedClass || students.length === 0) return;
    try {
      setSaving(true);
      setError("");
      await api.post("attendance/mark/", {
        class_id: selectedClass,
        date: attendanceDate,
        records: students.map(s => ({
          student_id: s.id,
          status: s.status
        }))
      });
      alert("Attendance saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save attendance. Try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchMyClasses();
  }, [fetchMyClasses]);

  useEffect(() => {
    fetchStudents(selectedClass);
  }, [selectedClass, fetchStudents]);

  if (loading && classes.length === 0) return <Spinner />;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="card">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Mark Attendance</h1>
        <p className="text-gray-500 mt-1 text-sm">Date: {attendanceDate}</p>
      </div>

      {error && (
        <div className="card bg-red-50 border border-red-200 text-red-700 p-4">
          {error}
        </div>
      )}

      {/* Class Selector */}
      <div className="card">
        <label className="form-lable">Select Class</label>
        <select
          className="milk-input"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          disabled={saving}
        >
          <option value="">-- Choose a class --</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name || cls.class_name}</option>
          ))}
        </select>
      </div>

      {/* Student List */}
      {selectedClass ? (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Students ({students.length})</h2>

          {students.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No students found in this class.</p>
          ) : (
            <div className="space-y-3">
              {students.map(student => (
                <div key={student.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border border-gray-200 rounded-lg p-3">
                  <span className="font-medium text-gray-800">{student.name || `${student.first_name || ""} ${student.last_name || ""}`}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => markStatus(student.id, "present")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        student.status === "present"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markStatus(student.id, "absent")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        student.status === "absent"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => markStatus(student.id, "late")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        student.status === "late"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Late
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          {students.length > 0 && (
            <div className="mt-6">
              <button
                className="milk-btn w-full sm:w-auto"
                onClick={saveAttendance}
                disabled={saving}
              >
                {saving && <ButtonSpinner />}
                Save Attendance
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-10 text-gray-500">
          Please select a class to view students.
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;