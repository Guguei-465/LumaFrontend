import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

const FeeStructureList = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchStructures = async () => {
    try {
      const { data } = await api.get("fees/structures/");
      setFeeStructures(data);
    } catch {
      toast.error("Failed to load fee structures");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchStructures(); }, []);

  const filtered = feeStructures.filter(f =>
    f.class_name?.toLowerCase().includes(search.toLowerCase()) ||
    f.term?.toLowerCase().includes(search.toLowerCase()) ||
    f.academic_year?.includes(search)
  );

  const handleDelete = async (id, className) => {
    if (!window.confirm(`Delete fee structure for ${className}?`)) return;
    try {
      await api.delete(`fees/structures/${id}/`);
      toast.success("Fee structure deleted");
      fetchStructures();
    } catch { toast.error("Delete failed — may have linked payments"); }
  };

  const formatAmount = (amt) => `KES ${amt?.toLocaleString() || 0}`;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-5">
        <h2 className="text-2xl font-bold">Fee Structures</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Search class / term..." className="milk-input flex-1" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => navigate("/admin-dashboard/fees/structures/add")} className="milk-btn whitespace-nowrap">+ New Fee Structure</button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading fee structures...</p>}
      {!loading && filtered.length === 0 && <p className="text-gray-500">{search ? "No matches" : "No fee structures set up yet"}</p>}

      {filtered.length > 0 && (
        <div className="hidden md:block card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Term / Year</th>
                <th className="p-3 text-left">Tuition</th>
                <th className="p-3 text-left">Total Fee</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{f.class_name}</td>
                  <td className="p-3">{f.term} | {f.academic_year}</td>
                  <td className="p-3">{formatAmount(f.tuition_fee)}</td>
                  <td className="p-3 font-semibold text-teal-600">{formatAmount(f.total_fee)}</td>
                  <td className="p-3 space-x-2 text-xs">
                    <button onClick={() => navigate(`/admin-dashboard/fees/structures/edit/${f.id}`)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(f.id, f.class_name)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeeStructureList;