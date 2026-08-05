import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const AdminTimetables = () => {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetables();
  }, []);

  useEffect(() => {
    filterTimetables();
  }, [search, timetables]);

  const fetchTimetables = async () => {
    try {
      const response = await api.get("timetable/");
      setTimetables(response.data);
      setFilteredTimetables(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterTimetables = () => {
    let data = [...timetables];

    if (search.trim() !== "") {
      data = data.filter(
        (item) =>
          item.teacher?.toLowerCase().includes(search.toLowerCase()) ||
          item.subject?.toLowerCase().includes(search.toLowerCase()) ||
          item.classroom?.toLowerCase().includes(search.toLowerCase()) ||
          item.day?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTimetables(data);
  };

  const deleteTimetable = async (id) => {
    if (!window.confirm("Delete this timetable?")) return;

    try {
      await api.delete(`timetable/delete/${id}/`);
      fetchTimetables();
    } catch (error) {
      console.log(error);
      alert("Unable to delete timetable.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">
          Loading Timetable...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            School Timetable
          </h2>

          <Link
            to="/admin/timetable/create"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + Add Lesson
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search timetable..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Day</th>
                <th className="p-3 text-left">Teacher</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Term</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredTimetables.length > 0 ? (
                filteredTimetables.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{item.day}</td>

                    <td className="p-3">{item.teacher}</td>

                    <td className="p-3">{item.subject}</td>

                    <td className="p-3">{item.classroom}</td>

                    <td className="p-3">
                      {item.start_time} - {item.end_time}
                    </td>

                    <td className="p-3">{item.term}</td>

                    <td className="p-3 flex justify-center gap-2">

                      <Link
                        to={`/admin/timetable/edit/${item.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteTimetable(item.id)}
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
                    No timetable records found.
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

export default AdminTimetables;