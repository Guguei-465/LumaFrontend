import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const TimetableForm = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({
    teacher: "", subject: "", classroom: "",
    day: "", start_time: "", end_time: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("teachers/").then(r => { const d = Array.isArray(r.data) ? r.data : r.data.results || []; setTeachers(d); }).catch(console.log);
    api.get("subjects/").then(r => { const d = Array.isArray(r.data) ? r.data : r.data.results || []; setSubjects(d); }).catch(console.log);
    api.get("classes/").then(r => { const d = Array.isArray(r.data) ? r.data : r.data.results || []; setClassrooms(d); }).catch(console.log);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.post("timetable/create/", formData);
      navigate("/academic-coordinator/timetable");
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save lesson");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Lesson</h2>
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
          <select required value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Select Teacher</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.first_name} {t.user?.last_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select required value={formData.classroom} onChange={e => setFormData({...formData, classroom: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Select Class</option>
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.grade} {c.stream}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
          <select required value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Select Day</option>
            {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input type="time" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input type="time" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60">
            {loading ? "Saving..." : "Add Lesson"}
          </button>
          <button type="button" onClick={() => navigate("/academic-coordinator/timetable")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimetableForm;
