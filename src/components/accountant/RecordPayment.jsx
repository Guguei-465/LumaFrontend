import React, { useEffect, useState } from "react";
import api from "../api/api";

// --- Reusable Spinners ---
const Spinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const ButtonSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
);

const RecordPayment = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentBalance, setStudentBalance] = useState({ total_expected: 0, total_paid: 0, balance: 0 });

  const [paymentData, setPaymentData] = useState({
    amount_paid: "",
    payment_method: "",
    transaction_ref: "",
    term: "",
    notes: "",
  });

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showStudentList, setShowStudentList] = useState(false);

  // --- Load student list on mount ---
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await api.get("students/");
        setStudents(res.data || []);
      } catch (err) {
        console.error("Failed to load students:", err);
        setError("Could not load student list.");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // --- Filter students as user types ---
  useEffect(() => {
    if (!searchStudent.trim()) {
      setFilteredStudents([]);
      return;
    }
    const term = searchStudent.toLowerCase();
    const filtered = students.filter(s =>
      s.name?.toLowerCase().includes(term) ||
      s.admission_number?.toLowerCase().includes(term)
    );
    setFilteredStudents(filtered);
  }, [searchStudent, students]);

  // --- When student selected: load their balance ---
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setSearchStudent(student.name);
    setShowStudentList(false);
    setSuccess(""); setError("");

    try {
      const res = await api.get(`fees/student-balance/${student.id}/`);
      setStudentBalance(res.data);
    } catch (err) {
      console.error("Failed to load balance:", err);
      setError("Could not load student fee balance.");
    }
  };

  // --- Update form fields ---
  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    setSuccess(""); setError("");
  };

  // --- Submit payment ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return setError("Please select a student first.");
    if (!paymentData.amount_paid || Number(paymentData.amount_paid) <= 0) {
      return setError("Please enter a valid payment amount.");
    }
    if (!paymentData.payment_method) return setError("Please select payment method.");
    if (!paymentData.term) return setError("Please select academic term.");

    try {
      setSubmitting(true);
      setError(""); setSuccess("");

      await api.post("fees/record-payment/", {
        student_id: selectedStudent.id,
        amount_paid: Number(paymentData.amount_paid),
        payment_method: paymentData.payment_method,
        transaction_ref: paymentData.transaction_ref,
        term: paymentData.term,
        notes: paymentData.notes,
      });

      setSuccess(`Payment recorded successfully! Receipt generated.`);
      // Reset form
      setPaymentData({ amount_paid: "", payment_method: "", transaction_ref: "", term: "", notes: "" });
      setSelectedStudent(null);
      setSearchStudent("");
      setStudentBalance({ total_expected:0, total_paid:0, balance:0 });
    } catch (err) {
      console.error("Payment save failed:", err);
      setError(err.response?.data?.detail || "Failed to record payment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="card">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Record New Fee Payment</h1>
        <p className="text-gray-500 mt-1 text-sm">Enter student payment details & save official record</p>
      </div>

      {/* Status Messages */}
      {error && <div className="card bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}
      {success && <div className="card bg-green-50 border border-green-200 text-green-700 p-4">{success}</div>}

      {/* --- Main Form Card --- */}
      <div className="card max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Search & Select Student */}
          <div className="relative">
            <label className="form-lable">Search & Select Student *</label>
            <input
              type="text"
              placeholder="Type student name or admission number..."
              className="milk-input w-full"
              value={searchStudent}
              onChange={(e) => { setSearchStudent(e.target.value); setShowStudentList(true); setSelectedStudent(null); }}
              onFocus={() => searchStudent && setShowStudentList(true)}
              onBlur={() => setTimeout(() => setShowStudentList(false), 200)}
            />

            {/* Student dropdown list */}
            {showStudentList && filteredStudents.length > 0 && (
              <div className="absolute z-20 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                {loadingStudents ? (
                  <p className="p-3 text-gray-500">Loading students...</p>
                ) : (
                  filteredStudents.map(stud => (
                    <button
                      key={stud.id}
                      type="button"
                      className="w-full text-left p-3 hover:bg-blue-50 border-b last:border-b-0"
                      onClick={() => handleSelectStudent(stud)}
                    >
                      <p className="font-medium">{stud.name}</p>
                      <p className="text-sm text-gray-500">Adm: {stud.admission_number} | Class: {stud.class_name}</p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* --- Student Balance Summary --- */}
          {selectedStudent && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Expected</p>
                <p className="font-bold text-lg">KSh {studentBalance.total_expected.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="font-bold text-lg text-green-600">KSh {studentBalance.total_paid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="font-bold text-lg text-red-600">KSh {studentBalance.balance.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* --- Payment Details --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-lable">Amount Paid (KSh) *</label>
              <input
                type="number"
                name="amount_paid"
                className="milk-input w-full"
                value={paymentData.amount_paid}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="form-lable">Payment Method *</label>
              <select
                name="payment_method"
                className="milk-input w-full"
                value={paymentData.payment_method}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Method --</option>
                <option value="Cash">Cash</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="form-lable">Transaction / Receipt Reference</label>
              <input
                type="text"
                name="transaction_ref"
                className="milk-input w-full"
                value={paymentData.transaction_ref}
                onChange={handleChange}
                placeholder="e.g. M-Pesa code / Cheque No."
              />
            </div>

            <div>
              <label className="form-lable">Academic Term *</label>
              <select
                name="term"
                className="milk-input w-full"
                value={paymentData.term}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Term --</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="form-lable">Additional Notes</label>
              <textarea
                name="notes"
                className="milk-input w-full"
                value={paymentData.notes}
                onChange={handleChange}
                placeholder="Optional: any extra details..."
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="milk-btn w-full md:w-auto px-8"
            disabled={submitting || !selectedStudent}
          >
            {submitting && <ButtonSpinner />}
            {submitting ? "Saving Payment..." : "✅ Save & Generate Receipt"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordPayment;