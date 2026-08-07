import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const TeacherStudents = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Students error:", err);
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

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
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Students</h1>
        <p className="text-gray-500 mt-1 text-sm">View all students in your assigned classes</p>
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
        >
          <option value="">-- Choose a class --</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name || cls.class_name}
            </option>
          ))}
        </select>
      </div>

      {/* Student List */}
      {selectedClass ? (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Students ({students.length})
          </h2>

          {students.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No students found in this class.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Adm No.</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Full Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Gender</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Parent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700 font-mono text-sm">
                        {student.admission_number || student.adm_no || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {student.name || `${student.first_name || ""} ${student.last_name || ""}`}
                      </td>
                      <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">
                        {student.gender || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                        {student.parent_name || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default TeacherStudents;