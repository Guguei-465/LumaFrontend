import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

const EditFeeStructure = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    class_name: "",
    term: "",
    academic_year: "",
    tuition_fee: 0,
    uniform_fee: 0,
    boarding_fee: 0,
    activity_fee: 0,
    other_charges: 0,
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Auto calculate total fee
  const total = Object.values(form).reduce((sum, val) => typeof val === "number" ? sum+val : sum, 0);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
const { data } = await api.get(`fees/fee-structures/${id}/`);
        setForm({
          class_name: data.class_name || "",
          term: data.term || "",
          academic_year: data.academic_year || new Date().getFullYear(),
          tuition_fee: data.tuition_fee || 0,
          uniform_fee: data.uniform_fee || 0,
          boarding_fee: data.boarding_fee || 0,
          activity_fee: data.activity_fee || 0,
          other_charges: data.other_charges || 0,
          notes: data.notes || ""
        });
      } catch {
        toast.error("❌ Failed to load fee structure");
      } finally { setFetching(false); }
    };
    fetchStructure();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.includes("fee") || name.includes("charges") ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
await api.patch(`fees/fee-structures/${id}/`, {...form, total_fee: total});
      toast.success("✅ Fee structure updated successfully!");
      setTimeout(() => navigate("/admin-dashboard/fees/structures"), 1200);
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data).flat().join(" ") : "Update failed";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  if (fetching) return <p className="p-6 text-gray-500">Loading fee structure...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/admin-dashboard/fees/structures")} className="text-gray-500 hover:text-gray-700 text-sm">← Back</button>
        <h2 className="text-3xl font-bold">Edit Fee Structure</h2>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <p className="text-xs uppercase tracking-widest text-teal-600 font-semibold">Class & Period</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="form-label">Class *</label><input name="class_name" className="milk-input" value={form.class_name} onChange={handleChange} required /></div>
          <div><label className="form-label">Term *</label>
            <select name="term" className="milk-input" value={form.term} onChange={handleChange} required>
              <option value="">Select Term</option>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>
          <div><label className="form-label">Year *</label><input type="number" name="academic_year" className="milk-input" value={form.academic_year} onChange={handleChange} required /></div>
        </div>

        <p className="text-xs uppercase tracking-widest text-teal-600 font-semibold pt-2">Fee Breakdown (KES)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="form-label">Tuition Fee *</label><input type="number" name="tuition_fee" className="milk-input" value={form.tuition_fee} onChange={handleChange} required /></div>
          <div><label className="form-label">Uniform Fee</label><input type="number" name="uniform_fee" className="milk-input" value={form.uniform_fee} onChange={handleChange} /></div>
          <div><label className="form-label">Boarding Fee</label><input type="number" name="boarding_fee" className="milk-input" value={form.boarding_fee} onChange={handleChange} /></div>
          <div><label className="form-label">Activity Fee</label><input type="number" name="activity_fee" className="milk-input" value={form.activity_fee} onChange={handleChange} /></div>
        </div>
        <div><label className="form-label">Other Charges</label><input type="number" name="other_charges" className="milk-input" value={form.other_charges} onChange={handleChange} /></div>

        <div className="p-3 bg-teal-50 rounded">
          <p className="text-lg font-bold text-teal-700">Updated Total Fee: KES {total.toLocaleString()}</p>
        </div>

        <div><label className="form-label">Notes / Description</label><textarea name="notes" className="milk-input resize-none" rows={2} value={form.notes} onChange={handleChange} /></div>

        <button type="submit" disabled={loading} className="milk-btn w-full">{loading ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );
};

export default EditFeeStructure;