import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const ParentPayment = () => {
  const { studentId: urlStudentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(urlStudentId || "");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    phone: "",
    description: "School Fees",
  });

  // Load children list
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get("dashboard/parent/children/");
        console.log(res)
        const list = Array.isArray(res.data) ? res.data : [];
        setChildren(list);

        if (urlStudentId && list.length > 0) {
          const found = list.find(c => String(c.student_id || c.id) === String(urlStudentId));
          if (found) {
            setSelectedStudent(found);
            setSelectedStudentId(String(urlStudentId));
          }
        }
      } catch (err) {
        console.error("Failed to load children:", err.response?.status, err.response?.data);
      }
    };
    fetchChildren();
  }, [urlStudentId]);

  // Update selected student display
  useEffect(() => {
    if (!selectedStudentId || children.length === 0) {
      setSelectedStudent(null);
      return;
    }
    const found = children.find(c => String(c.student_id || c.id) === String(selectedStudentId));
    setSelectedStudent(found || null);
  }, [selectedStudentId, children]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert("Please select a child first.");
      return;
    }

    const amountNum = Number(formData.amount);
    if (isNaN(amountNum) || amountNum < 100) {
      alert("Amount must be at least KES 100.");
      return;
    }

    setLoading(true);
    try {
      // Clean payload exactly as backend expects
      await api.post("fees/payments/stk-push/", {
        student_id: Number(selectedStudentId),
        amount: amountNum,
        phone: formData.phone.replace(/\D/g, "").replace(/^0/, "254"),
        description: formData.description.trim() || "School Fees",
      });

      alert(`Payment initiated!\nCheck your phone for the M-Pesa prompt.\n\nPaying for: ${selectedStudent?.first_name || "Child"}`);
      setFormData({ amount: "", phone: "", description: "School Fees" });
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("Payment error:", err.response?.status, err.response?.data);
      const msg = err.response?.data?.detail || err.response?.data?.message || "Server error — please try again shortly.";
      alert(`Failed to start payment.\n${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Make Payment</h3>
        <p className="text-sm text-gray-500 mt-1">Pay via M-Pesa for your child's fees.</p>
      </div>

      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Child Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Child</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            required
          >
            <option value="">-- Choose a child --</option>
            {children.map((child) => (
              <option key={child.student_id || child.id} value={String(child.student_id || child.id)}>
                {child.first_name} {child.last_name} — {child.grade} {child.stream}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Child Info */}
        {selectedStudent && (
          <div className="mb-5 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              Paying for: <strong>{selectedStudent.first_name} {selectedStudent.last_name}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              {selectedStudent.grade} {selectedStudent.stream}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Amount (KES)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="100"
              step="1"
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">M-Pesa Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="07XXXXXXXX"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Term 1 Fees"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedStudentId}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              "Pay via M-Pesa"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParentPayment;