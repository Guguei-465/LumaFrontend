import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const TimeTable = () => {
  const [timetable, setTimetable] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTimetable = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await api.get(
        "timetable/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTimetable(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  useEffect(() => {
    const data = timetable.filter(
      (item) =>
        item.teacher?.toLowerCase().includes(search.toLowerCase()) ||
        item.subject?.toLowerCase().includes(search.toLowerCase()) ||
        item.classroom?.toLowerCase().includes(search.toLowerCase()) ||
        item.day?.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(data);
  }, [search, timetable]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Timetable
            </h2>
            <p className="text-gray-500">
              Manage class timetable schedules.
            </p>
          </div>

          <Link
            to="/academic-coordinator/timetable/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <i className="bi bi-plus-circle-fill"></i>
            Add Lesson
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>

          <input
            type="text"
            placeholder="Search timetable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3">Day</th>
                <th className="text-left px-4 py-3">Teacher</th>
                <th className="text-left px-4 py-3">Subject</th>
                <th className="text-left px-4 py-3">Class</th>
                <th className="text-left px-4 py-3">Start</th>
                <th className="text-left px-4 py-3">End</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500"
                  >
                    Loading timetable...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500"
                  >
                    No timetable found.
                  </td>
                </tr>
              ) : (
                filtered.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{lesson.day}</td>
                    <td className="px-4 py-3">{lesson.teacher}</td>
                    <td className="px-4 py-3">{lesson.subject}</td>
                    <td className="px-4 py-3">{lesson.classroom}</td>
                    <td className="px-4 py-3">{lesson.start_time}</td>
                    <td className="px-4 py-3">{lesson.end_time}</td>

                    <td className="text-center px-4 py-3">
                      {lesson.is_active ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="text-center px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default TimeTable;