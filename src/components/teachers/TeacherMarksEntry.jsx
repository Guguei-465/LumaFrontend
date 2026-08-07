import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const ButtonSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
);

const TeacherMarksEntry = () => {
  const { assessment_id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get(`results/assessments/${assessment_id}/`);
      setAssessment(data);
      // Load students for this assessment's class
      const { data: studentData } = await api.get(
        `dashboard/teacher/students/?class_id=${data.class_id}`
      );
      const list = Array.isArray(studentData) ? studentData : [];
      // Attach mark field to each student
      setStudents(list.map(s => ({ ...s, mark: "" })));
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load assessment or students.");
    } finally {
      setLoading(false);
    }
  }, [assessment_id]);

  const updateMark = (studentId, value) => {
    if (!assessment) return;
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > assessment.max_score) return;
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, mark: value } : s
    ));
  };

  const saveMarks = async () => {
    if (!assessment_id || students.length === 0) return;
    try {
      setSaving(true);
      setError("");
      await api.post(`dashboard/teacher/assessments/${assessment_id}/save-marks/`, {
        marks: students.map(s => ({
          student_id: s.id,
          score: Number(s.mark) || 0
        }))
      });
      alert("✅ Marks saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save marks. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (assessment_id) fetchAssessment();
  }, [assessment_id, fetchAssessment]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="p-4 md:p-6">
        <div className="card bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>
      </div>
    );

  if (!assessment)
    return (
      <div className="p-4 md:p-6">
        <div className="card text-center py-10 text-gray-500">Assessment not found.</div>
      </div>
    );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="card">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Enter Marks</h1>
        <p className="text-gray-600 mt-2">
          <strong>{assessment.name}</strong> — Max Score: {assessment.max_score}
        </p>
      </div>

      {/* Student Marks Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Students ({students.length})</h2>

        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No students found for this class.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Adm No.</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Student Name</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Mark / {assessment.max_score}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-700">
                      {student.admission_number || student.adm_no || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {student.name || `${student.first_name || ""} ${student.last_name || ""}`}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max={assessment.max_score}
                        value={student.mark}
                        onChange={(e) => updateMark(student.id, e.target.value)}
                        className="milk-input text-center w-24 mx-auto"
                        placeholder="0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Save Button */}
        {students.length > 0 && (
          <div className="mt-6 text-right">
            <button className="milk-btn" onClick={saveMarks} disabled={saving}>
              {saving && <ButtonSpinner />}
              Save All Marks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherMarksEntry;