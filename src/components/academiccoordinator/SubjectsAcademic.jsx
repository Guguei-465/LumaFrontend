import { useEffect, useState } from "react";
import api from "../api/api";

const SubjectsAcademic = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", code: "", description: "" });

  useEffect(() => { fetchSubjects(); }, []);

  useEffect(() => {
    const results = subjects.filter(
      (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSubjects(results);
  }, [search, subjects]);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("subjects/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setSubjects(data);
      setFilteredSubjects(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditing(false);
    setFormData({ id: "", name: "", code: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setEditing(true);
    setFormData(subject);
    setShowModal(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`subjects/update/${formData.id}/`, formData);
      } else {
        await api.post("subjects/create/", formData);
      }
      fetchSubjects();
      setShowModal(false);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      await api.delete(`subjects/delete/${id}/`);
      fetchSubjects();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Subjects</h2>
          <p className="text-gray-500">Manage school subjects</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2">
          <i className="bi bi-plus-circle-fill"></i> Add Subject
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="relative">
          <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="text-center py-16">Loading...</div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10">No subjects found.</td></tr>
              ) : (
                filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">{subject.code}</td>
                    <td className="px-4 py-4 font-semibold">{subject.name}</td>
                    <td className="px-4 py-4">{subject.description}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-4">
                        <button onClick={() => openEditModal(subject)} className="text-green-600 hover:text-green-800">
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button onClick={() => deleteSubject(subject.id)} className="text-red-600 hover:text-red-800">
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold">{editing ? "Edit Subject" : "Add Subject"}</h3>
              <button onClick={() => setShowModal(false)}>
                <i className="bi bi-x-circle-fill text-red-600 text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="font-medium">Subject Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-2 border rounded-lg p-3" />
              </div>
              <div>
                <label className="font-medium">Subject Code</label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} required className="w-full mt-2 border rounded-lg p-3" />
              </div>
              <div>
                <label className="font-medium">Description</label>
                <textarea rows="4" name="description" value={formData.description} onChange={handleChange} className="w-full mt-2 border rounded-lg p-3" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 bg-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{editing ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsAcademic;
