import { useEffect, useState } from "react";
import api from "../api/api";

const ReportComments = () => {
  const [comments, setComments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ id: "", title: "", comment: "" });

  const fetchComments = async () => {
    try {
      const res = await api.get("results/report-comments/");
      const data = res.data.results || res.data;
      setComments(data);
      setFiltered(data);
    } catch (error) {
      console.error("Failed to load report comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComments(); }, []);

  useEffect(() => {
    const data = comments.filter(
      (item) =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.comment?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(data);
  }, [search, comments]);

  const openAddModal = () => {
    setEditing(false);
    setFormData({ id: "", title: "", comment: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditing(true);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`results/report-comments/${formData.id}/`, formData);
      else await api.post("results/report-comments/", formData);
      fetchComments();
      setShowModal(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Could not save report comment!");
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this report comment?")) return;
    try {
      await api.delete(`results/report-comments/${id}/`);
      fetchComments();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">Report Comments</h2>
          <p className="text-gray-500">Manage reusable teacher comments for report cards</p>
        </div>
        <button onClick={openAddModal} className="milk-btn flex items-center gap-2 w-fit">
          <i className="bi bi-plus-circle-fill"></i> Add Comment
        </button>
      </div>

      <div className="card">
        <div className="relative max-w-md">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by title or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="milk-input pl-10"
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <i className="bi bi-arrow-repeat animate-spin text-2xl mb-2"></i>
            <p>Loading report comments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {search ? "No matching comments found." : "No report comments defined yet."}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-green-200">
                <th className="px-4 py-3 text-green-700 font-semibold">Title</th>
                <th className="px-4 py-3 text-green-700 font-semibold">Comment</th>
                <th className="px-4 py-3 text-green-700 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-green-50">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">{item.comment || item.text || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => openEditModal(item)} className="text-green-600 hover:text-green-800 text-lg">
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button onClick={() => deleteComment(item.id)} className="text-red-600 hover:text-red-800 text-lg">
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-green-200 px-6 py-4">
              <h3 className="text-xl font-semibold">{editing ? "Edit Report Comment" : "Add New Comment"}</h3>
              <button onClick={() => setShowModal(false)} className="text-red-500 hover:text-red-700">
                <i className="bi bi-x-circle-fill text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-lable">Title <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="milk-input" placeholder="e.g. Excellent Performance" />
              </div>
              <div>
                <label className="form-lable">Comment <span className="text-red-500">*</span></label>
                <textarea name="comment" rows={4} value={formData.comment || formData.text || ""} onChange={handleChange} required className="milk-input" placeholder="Full comment shown on report card" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                <button type="submit" className="milk-btn px-5">{editing ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportComments;
