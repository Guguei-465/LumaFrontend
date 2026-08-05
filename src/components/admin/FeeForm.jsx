import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const FeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({ classroom: "", academic_year: "", term: "", amount: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("classes/").then(r => setClassrooms(r.data)).catch(console.log);
    if (isEdit) {
      api.get(`fees/${id}/`).then(r => setFormData(r.data)).catch(console.log);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (isEdit) {
        await api.put(`fees/update/${id}/`, formData);
      } else {
        await api.post("fees/create/", formData);
      }
      navigate("/admin/fees");
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save fee structure");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? "Edit Fee Structure" : "Add Fee Structure"}</h2>
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
          <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60">
            {loading ? "Saving..." : isEdit ? "Update Fee" : "Add Fee Structure"}
          </button>
          <button type="button" onClick={() => navigate("/admin/fees")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeeForm;
