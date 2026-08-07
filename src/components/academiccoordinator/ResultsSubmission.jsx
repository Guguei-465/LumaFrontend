import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const ResultsSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await api.get(
        "results/result-submissions/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmissions(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const data = submissions.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(data);
  }, [search, submissions]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Result Submissions
            </h2>
            <p className="text-gray-500">
              Manage submitted examination results.
            </p>
          </div>

          <Link
            to="/academic-coordinator/result-submissions/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <i className="bi bi-plus-circle-fill"></i>
            New Submission
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>

          <input
            type="text"
            placeholder="Search submissions..."
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
                <th className="text-left px-4 py-3">Assessment</th>
                <th className="text-left px-4 py-3">Teacher</th>
                <th className="text-left px-4 py-3">Class</th>
                <th className="text-left px-4 py-3">Submitted At</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    No submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {submission.assessment_name || submission.assessment}
                    </td>

                    <td className="px-4 py-3">
                      {submission.teacher_name || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {submission.classroom_name || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {submission.submitted_at || "-"}
                    </td>

                    <td className="text-center px-4 py-3">
                      {submission.approval_status === "APPROVED" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                          <i className="bi bi-check-circle-fill"></i>
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                          <i className="bi bi-clock-fill"></i>
                          {submission.approval_status}
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

export default ResultsSubmissions;