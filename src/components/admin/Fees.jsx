import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFees();
  }, []);

  useEffect(() => {
    filterFees();
  }, [search, fees]);

  const fetchFees = async () => {
    try {
      const response = await api.get("fees/");
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setFees(data);
      setFilteredFees(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterFees = () => {
    let data = [...fees];

    if (search.trim() !== "") {
      data = data.filter(
        (fee) =>
          fee.classroom_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          fee.term
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          fee.academic_year
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredFees(data);
  };

  const deleteFee = async (id) => {
    if (!window.confirm("Delete this fee structure?")) return;

    try {
      await api.delete(`fees/delete/${id}/`);
      fetchFees();
    } catch (error) {
      console.log(error);
      alert("Unable to delete fee structure.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">
          Loading Fee Structures...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Fee Structures
          </h2>

          <Link
            to="/admin/fees/create"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + Add Fee Structure
          </Link>

        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Academic Year</th>
                <th className="p-3 text-left">Term</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-center">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredFees.length > 0 ? (
                filteredFees.map((fee) => (
                  <tr
                    key={fee.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{fee.classroom_name}</td>

                    <td className="p-3">{fee.academic_year}</td>

                    <td className="p-3">{fee.term}</td>

                    <td className="p-3 font-semibold text-green-700">
                      KES {fee.amount}
                    </td>

                    <td className="p-3 flex justify-center gap-2">

                      <Link
                        to={`/admin/fees/edit/${fee.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteFee(fee.id)}
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
                    colSpan="5"
                    className="text-center py-8 text-gray-500"
                  >
                    No fee structures found.
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

export default Fees;