import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

const ListParents = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchParents = async () => {
    try {
      const { data } = await api.get("parents/");
      setParents(data);
    } catch { toast.error("Failed to load parents"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchParents(); }, []);

  const filtered = parents.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    p.phone_number?.includes(search)
  );

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete parent ${name}?`)) return;
    try { await api.delete(`parents/${id}/`); toast.success("Parent deleted"); fetchParents(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-5">
        <h2 className="text-2xl font-bold">Parent / Guardian Management</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Search name / phone..." className="milk-input flex-1" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => navigate("/admin-dashboard/parents/add")} className="milk-btn whitespace-nowrap">+ Add New Parent</button>
        </div>
      </div>

      {loading && <p>Loading parents...</p>}
      {!loading && filtered.length === 0 && <p className="text-gray-500">{search ? "No matches" : "No parents registered"}</p>}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="card p-4">
              <h3 className="font-bold text-lg">{p.first_name} {p.last_name}</h3>
              <p className="text-sm text-gray-600 mt-1">{p.phone_number}</p>
              <p className="text-sm text-gray-600">{p.email || "No email"}</p>
              <p className="text-sm font-medium text-teal-600 mt-2">{p.children_count || 0} linked student(s)</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => navigate(`/admin-dashboard/parents/edit/${p.id}`)} className="flex-1 bg-blue-500 text-white py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(p.id, p.first_name)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListParents;