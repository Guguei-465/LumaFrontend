import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";


const Parents = () => {
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchParents();
  }, []);

  useEffect(() => {
    filterParents();
  }, [search, parents]);

  const fetchParents = async () => {
    try {
      const response = await api.get("accounts/parents/");
      setParents(response.data);
      setFilteredParents(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterParents = () => {
    let data = [...parents];

    if (search.trim() !== "") {
      data = data.filter(
        (parent) =>
          parent.user?.first_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          parent.user?.last_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          parent.user?.email
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          parent.user?.phone_number
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredParents(data);
  };

  const deleteParent = async (id) => {
    if (!window.confirm("Delete this parent?")) return;

    try {
      await api.delete(`accounts/parents/delete/${id}/`);
      fetchParents();
    } catch (error) {
      console.log(error);
      alert("Unable to delete parent.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">Loading Parents...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Parents</h2>

          <Link
            to="/admin/register-user"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + Register Parent
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search parent..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Photo</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParents.length > 0 ? (
                filteredParents.map((parent) => (
                  <tr
                    key={parent.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {parent.user?.photo ? (
                        <img
                          src={parent.user.photo}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <i className="bi bi-person-fill text-xl"></i>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {parent.user?.first_name} {parent.user?.last_name}
                    </td>

                    <td className="px-4 py-3">
                      {parent.user?.email}
                    </td>

                    <td className="px-4 py-3">
                      {parent.user?.phone_number}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          parent.user?.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {parent.user?.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 flex gap-2">
                      <Link
                        to={`/admin/parents/${parent.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </Link>

                      <Link
                        to={`/admin/parents/edit/${parent.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteParent(parent.id)}
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
                    colSpan="6"
                    className="text-center py-8 text-gray-500"
                  >
                    No parents found.
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

export default Parents;