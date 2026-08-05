import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const ClassForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState({ grade: "", stream: "", capacity: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`classes/${id}/`).then(r => setFormData(r.data)).catch(console.log);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (isEdit) {
        await api.put(`classes/update/${id}/`, formData);
      } else {
        await api.post("classes/create/", formData);
      }
      navigate("/admin/classes");
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save class");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? "Edit Class" : "Add Class"}</h2>
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
          <input type="text" required value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}
            placeholder="e.g. Grade 1" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
          <input type="text" value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value})}
            placeholder="e.g. A" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
          <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60">
            {loading ? "Saving..." : isEdit ? "Update Class" : "Add Class"}
          </button>
          <button type="button" onClick={() => navigate("/admin/classes")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;
