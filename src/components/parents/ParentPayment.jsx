import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

const ParentPayment = () => {
  const { studentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    phone: "",
    description: "School Fees",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/payments/initiate-mpesa/", {
        student_id: studentId,
        amount: formData.amount,
        phone: formData.phone.replace(/\D/g, "").replace(/^0/, "254"),
        description: formData.description,
      });
      alert("Payment initiated! Check your phone for M-Pesa prompt.");
      setFormData({ amount: "", phone: "", description: "School Fees" });
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to start payment. Please check your number and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Make Payment</h3>
        <p className="text-sm text-gray-500 mt-1">Pay via M-Pesa for your child's fees.</p>
      </div>

      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Amount (KES)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="100"
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay via M-Pesa"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParentPayment;