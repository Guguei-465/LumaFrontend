import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

const AddTeacher = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone_number: "",
    employee_id: "", subject_specialty: "", assigned_classes: "",
    password: "", is_active: true
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
try {
      await api.post("accounts/register/", { ...form, role: "TEACHER" });
      toast.success("✅ Teacher registered successfully!");
      navigate("/admin-dashboard/teachers");
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data).flat().join(" ") : "Failed to register teacher";
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/admin-dashboard/teachers")} className="text-gray-500 hover:text-gray-700 text-sm">← Back</button>
        <h2 className="text-3xl font-bold">Add New Teacher</h2>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <p className="text-xs uppercase tracking-widest text-teal-600 font-semibold">Personal Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="form-label">First Name *</label><input name="first_name" className="milk-input" value={form.first_name} onChange={handleChange} required /></div>
          <div><label className="form-label">Last Name *</label><input name="last_name" className="milk-input" value={form.last_name} onChange={handleChange} required /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="form-label">Email</label><input type="email" name="email" className="milk-input" value={form.email} onChange={handleChange} /></div>
          <div><label className="form-label">Phone Number *</label><input name="phone_number" className="milk-input" value={form.phone_number} onChange={handleChange} required /></div>
        </div>

        <p className="text-xs uppercase tracking-widest text-teal-600 font-semibold pt-2">Work Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="form-label">Employee ID *</label><input name="employee_id" className="milk-input" value={form.employee_id} onChange={handleChange} required /></div>
          <div><label className="form-label">Subject Specialty</label><input name="subject_specialty" className="milk-input" value={form.subject_specialty} onChange={handleChange} placeholder="e.g. Mathematics, Biology" /></div>
        </div>
        <div><label className="form-label">Assigned Classes</label><input name="assigned_classes" className="milk-input" value={form.assigned_classes} onChange={handleChange} placeholder="e.g. Form 1A, Grade 5" /></div>

        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 accent-teal-600" />
          <label htmlFor="is_active" className="form-label mb-0">Teacher is Active</label>
        </div>

        <button type="submit" disabled={submitting} className="milk-btn w-full">{submitting ? "Saving..." : "Register Teacher"}</button>
      </form>
    </div>
  );
};

export default AddTeacher;