import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const SubjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`subjects/${id}/`).then(r => setFormData(r.data)).catch(console.log);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (isEdit) {
        await api.put(`subjects/update/${id}/`, formData);
      } else {
        await api.post("subjects/create/", formData);
      }
      navigate("/admin/subjects");
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save subject");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? "Edit Subject" : "Add Subject"}</h2>
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
          <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60">
            {loading ? "Saving..." : isEdit ? "Update Subject" : "Add Subject"}
          </button>
          <button type="button" onClick={() => navigate("/admin/subjects")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm;
