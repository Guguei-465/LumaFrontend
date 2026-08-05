import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [search, announcements]);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get("announcements/");
      setAnnouncements(response.data);
      setFilteredAnnouncements(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnnouncements = () => {
    let data = [...announcements];

    if (search.trim() !== "") {
      data = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.target?.toLowerCase().includes(search.toLowerCase()) ||
          item.priority?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredAnnouncements(data);
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      await api.delete(`announcements/delete/${id}/`);
      fetchAnnouncements();
    } catch (error) {
      console.log(error);
      alert("Unable to delete announcement.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">
          Loading Announcements...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            School Announcements
          </h2>

          <Link
            to="/admin/announcements/create"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + New Announcement
          </Link>

        </div>

        <input
          type="text"
          placeholder="Search announcement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Target</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-center">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {item.title}
                    </td>

                    <td className="p-3">
                      {item.target}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          item.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : item.priority === "Normal"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td className="p-3">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-3 flex justify-center gap-2">

                      <Link
                        to={`/admin/announcements/edit/${item.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteAnnouncement(item.id)}
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
                    No announcements found.
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

export default Announcements;