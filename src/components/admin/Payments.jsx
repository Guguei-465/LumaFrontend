import React, { useEffect, useState } from "react";
import api from "../api/api";


const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [search, payments]);

  const fetchPayments = async () => {
    try {
      const response = await api.get("fee-payments/");
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let data = [...payments];

    if (search.trim() !== "") {
      data = data.filter(
        (payment) =>
          payment.student_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          payment.admission_number
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          payment.reference_number
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredPayments(data);
  };

  const deletePayment = async (id) => {
    if (!window.confirm("Delete this payment record?")) return;

    try {
      await api.delete(`fee-payments/delete/${id}/`);
      fetchPayments();
    } catch (error) {
      console.log(error);
      alert("Unable to delete payment.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">
          Loading Payments...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Fee Payments
          </h2>

        </div>

        <input
          type="text"
          placeholder="Search payment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Admission No.</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Reference</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {payment.student_name}
                    </td>

                    <td className="p-3">
                      {payment.admission_number}
                    </td>

                    <td className="p-3 text-green-700 font-semibold">
                      KES {payment.amount_paid}
                    </td>

                    <td className="p-3">
                      {payment.payment_method}
                    </td>

                    <td className="p-3">
                      {payment.reference_number}
                    </td>

                    <td className="p-3">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>

                    <td className="p-3 flex justify-center gap-2">

                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deletePayment(payment.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 text-gray-500"
                  >
                    No payments found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Payments;