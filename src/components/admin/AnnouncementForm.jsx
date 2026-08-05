import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const AnnouncementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState({ title: "", message: "", target: "", priority: "Normal" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`announcements/${id}/`).then(r => setFormData(r.data)).catch(console.log);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (isEdit) {
        await api.put(`announcements/update/${id}/`, formData);
      } else {
        await api.post("announcements/create/", formData);
      }
      navigate("/admin/announcements");
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save announcement");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? "Edit Announcement" : "New Announcement"}</h2>
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea rows="4" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
          <select required value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none">
            <option value="">Select Target</option>
            <option value="All">All</option>
            <option value="Parents">Parents</option>
            <option value="Teachers">Teachers</option>
            <option value="Students">Students</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none">
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60">
            {loading ? "Saving..." : isEdit ? "Update Announcement" : "Post Announcement"}
          </button>
          <button type="button" onClick={() => navigate("/admin/announcements")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;
