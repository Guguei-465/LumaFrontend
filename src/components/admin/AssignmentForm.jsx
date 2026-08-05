import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const AssignmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({ teacher: "", subject: "", classroom: "", academic_year: "", term: "", is_class_teacher: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("teachers/").then(r => { const d = Array.isArray(r.data) ? r.data : r.data.results || []; setTeachers(d); }).catch(console.log);
    api.get("subjects/").then(r => { const d = Array.isArray(r.data) ? r.data : r.data.results || []; setSubjects(d); }).catch(console.log);
    api.get("classes/").then(r => { const d = Array.isArray(r.data) ? r.data : r.data.results || []; setClassrooms(d); }).catch(console.log);
    if (isEdit) {
      api.get(`assignments/${id}/`).then(r => setFormData(r.data)).catch(console.log);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (isEdit) {
        await api.put(`assignments/update/${id}/`, formData);
      } else {
        await api.post("assignments/create/", formData);
      }
      navigate("/admin/assignments");
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save assignment");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? "Edit Assignment" : "New Assignment"}</h2>
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
          <select required value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none">
            <option value="">Select Teacher</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.first_name} {t.user?.last_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none">
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select required value={formData.classroom} onChange={e => setFormData({...formData, classroom: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none">
            <option value="">Select Class</option>
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.grade} {c.stream}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
          <input type="text" required placeholder="e.g. 2024" value={formData.academic_year}
            onChange={e => setFormData({...formData, academic_year: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
          <select required value={formData.term} onChange={e => setFormData({...formData, term: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none">
            <option value="">Select Term</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_class_teacher" checked={formData.is_class_teacher}
            onChange={e => setFormData({...formData, is_class_teacher: e.target.checked})}
            className="w-4 h-4 accent-green-600" />
          <label htmlFor="is_class_teacher" className="text-sm font-medium text-gray-700">Is Class Teacher</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60">
            {loading ? "Saving..." : isEdit ? "Update Assignment" : "Create Assignment"}
          </button>
          <button type="button" onClick={() => navigate("/admin/assignments")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
