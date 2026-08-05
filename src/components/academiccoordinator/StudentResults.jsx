import { useEffect, useState } from "react";
import api from "../api/api";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await api.get(
        "results/student-results/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const data = results.filter(
      (item) =>
        item.student_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.subject_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.grade?.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(data);
  }, [search, results]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Student Results
            </h2>
            <p className="text-gray-500">
              View students' subject performance.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>

          <input
            type="text"
            placeholder="Search student or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-center">Average</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-4 py-3 text-center">Position</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    Loading results...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    No student results found.
                  </td>
                </tr>
              ) : (
                filtered.map((result) => (
                  <tr
                    key={result.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {result.student_name}
                    </td>

                    <td className="px-4 py-3">
                      {result.subject_name}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {result.average_score}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {result.grade}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1">
                        <i className="bi bi-trophy-fill text-yellow-500"></i>
                        {result.subject_position}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
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

export default StudentResults;