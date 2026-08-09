import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

const RecordPayment = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_id: "",
    student_name: "",
    admission_number: "",
    fee_structure_id: "",
    total_expected: 0,
    amount_paid: 0,
    payment_method: "", // M-Pesa, Cash, Bank
    transaction_ref: "",
    payment_date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Simulate fetching student fee total when student selected
  const handleStudentSelect = async (e) => {
    const studentId = e.target.value;
    if (!studentId) return;
    try {
      // Example API call to get active fee for student
      const { data } = await api.get(`students/${studentId}/current-fee/`);
      setForm(prev => ({
        ...prev,
        student_id,
        student_name: data.student_name,
        admission_number: data.admission_number,
        fee_structure_id: data.structure_id,
        total_expected: data.total_fee
      }));
    } catch {
      toast.warn("Could not load student fee details — enter manually");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "amount_paid" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.amount_paid <= 0) return toast.error("Amount paid must be greater than zero");
    setSubmitting(true);
    try {
      await api.post("fees/payments/", form);
      toast.success("✅ Payment recorded successfully! Receipt generated");
      navigate("/admin-dashboard/fees/payments");
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data).flat().join(" ") : "Failed to record payment";
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  const remaining = Math.max(0, form.total_expected - form.amount_paid);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/admin-dashboard/fees/payments")} className="text-gray-500 hover:text-gray-700 text-sm">← Back to Payments</button>
        <h2 className="text-3xl font-bold">Record Fee Payment</h2>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <p className="text-xs uppercase tracking-widest text-teal-600 font-semibold">Student Details</p>
        <div>
          <label className="form-label">Select Student *</label>
          <select name="student_id" className="milk-input" onChange={handleStudentSelect} required>
            <option value="">-- Choose Student --</option>
            {/* Replace with dynamic list from API */}
            <option value="1">John Kamau - Form 1A</option>
            <option value="2">Jane Wanjiru - Grade 5</option>
          </select>
        </div>

        {form.student_name && (
          <div className="bg-gray-50 p-3 rounded">
            <p><strong>Student:</strong> {form.student_name}</p>
            <p><strong>Admission No:</strong> {form.admission_number}</p>
            <p><strong>Total Expected Fee:</strong> KES {form.total_expected.toLocaleString()}</p>
          </div>
        )}

        <p className="text-xs uppercase tracking-widest text-teal-600 font-semibold pt-2">Payment Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Amount Paid (KES) *</label>
            <input type="number" name="amount_paid" className="milk-input" value={form.amount_paid} onChange={handleChange} required />
          </div>
          <div>
            <label className="form-label">Payment Method *</label>
            <select name="payment_method" className="milk-input" value={form.payment_method} onChange={handleChange} required>
              <option value="">Select Method</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Transaction Reference / Receipt No</label>
            <input name="transaction_ref" className="milk-input" value={form.transaction_ref} onChange={handleChange} placeholder="M-Pesa code / Bank ref" />
          </div>
          <div>
            <label className="form-label">Payment Date</label>
            <input type="date" name="payment_date" className="milk-input" value={form.payment_date} onChange={handleChange} />
          </div>
        </div>

        {form.amount_paid > 0 && form.total_expected > 0 && (
          <div className={`p-3 rounded ${remaining === 0 ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-800"}`}>
            <p className="font-medium">Remaining Balance: KES {remaining.toLocaleString()}</p>
            {remaining === 0 && <p className="text-sm">✅ Fully Paid!</p>}
          </div>
        )}

        <div><label className="form-label">Remarks / Notes</label><textarea name="notes" className="milk-input resize-none" rows={2} value={form.notes} onChange={handleChange} placeholder="Partial payment, term completed etc." /></div>

        <button type="submit" disabled={submitting} className="milk-btn w-full">{submitting ? "Saving Payment..." : "Save & Issue Receipt"}</button>
      </form>
    </div>
  );
};

export default RecordPayment;