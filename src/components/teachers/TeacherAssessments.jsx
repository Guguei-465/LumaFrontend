import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const ButtonSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
);

const TeacherAssessments = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", assessment_type: "", max_score: 50 });

  const fetchBasics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("dashboard/teacher/");
      setClasses(Array.isArray(data?.classes) ? data.classes : []);
      setSubjects(Array.isArray(data?.subjects) ? data.subjects : []);
    } catch (err) {
      console.error("Basics error:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssessments = useCallback(async () => {
    if (!selectedClass || !selectedSubject) {
      setAssessments([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get(
        `results/assessments/?class_id=${selectedClass}&subject_id=${selectedSubject}`
      );
      setAssessments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Assessments error:", err);
      setError("Failed to load assessments.");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedSubject]);

  const createAssessment = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedSubject || !formData.name) return;
    try {
      setSaving(true);
      setError("");
      await api.post("results/assessments/", {
        class_id: selectedClass,
        subject_id: selectedSubject,
        name: formData.name,
        assessment_type: formData.assessment_type,
        max_score: Number(formData.max_score)
      });
      setFormData({ name: "", assessment_type: "", max_score: 50 });
      setShowForm(false);
      fetchAssessments();
    } catch (err) {
      console.error("Create error:", err);
      setError("Failed to create assessment.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => { fetchBasics(); }, [fetchBasics]);
  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

  if (loading && classes.length === 0) return <Spinner />;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="card">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Assessments & Marks</h1>
        <p className="text-gray-500 mt-1 text-sm">Create assessments and enter student marks</p>
      </div>

      {error && (
        <div className="card bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>
      )}

      {/* Filters */}
      <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-lable">Select Class</label>
          <select
            className="milk-input"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Choose Class --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="form-lable">Select Subject</label>
          <select
            className="milk-input"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">-- Choose Subject --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Add New Assessment */}
      {selectedClass && selectedSubject && (
        <div className="card">
          {!showForm ? (
            <button className="milk-btn" onClick={() => setShowForm(true)}>
              + Create New Assessment
            </button>
          ) : (
            <form onSubmit={createAssessment} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">New Assessment</h3>
              <div>
                <label className="form-lable">Assessment Name</label>
                <input
                  type="text"
                  className="milk-input"
                  placeholder="e.g. End of Term Exam"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                  required
                />
              </div>
              <div>
                <label className="form-lable">Type</label>
                <select
                  className="milk-input"
                  value={formData.assessment_type}
                  onChange={(e) => setFormData(p => ({...p, assessment_type: e.target.value}))}
                >
                  <option value="">-- Select Type --</option>
                  <option value="exam">Exam</option>
                  <option value="test">Test</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
              <div>
                <label className="form-lable">Maximum Score</label>
                <input
                  type="number"
                  className="milk-input"
                  value={formData.max_score}
                  onChange={(e) => setFormData(p => ({...p, max_score: e.target.value}))}
                  min="1"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-300" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="milk-btn" disabled={saving}>
                  {saving && <ButtonSpinner />} Save
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Assessment List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Assessments</h2>
        {!selectedClass || !selectedSubject ? (
          <p className="text-gray-500 text-center py-8">Select class and subject to view assessments.</p>
        ) : assessments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No assessments found.</p>
        ) : (
          <div className="space-y-3">
            {assessments.map(a => (
              <div key={a.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div>
                  <h4 className="font-semibold text-gray-800">{a.name}</h4>
                  <p className="text-sm text-gray-500 capitalize">{a.assessment_type} • Max: {a.max_score}</p>
                </div>
                <Link
                  to={`/teacher/assessments/${a.id}/marks`}
                  className="milk-btn whitespace-nowrap text-center"
                >
                  Enter Marks
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssessments;