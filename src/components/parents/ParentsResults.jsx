import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../UseAvata";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-green-600"></div>
  </div>
);

const ParentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      // ✅ Step 1: Get your children list (EXISTS: dashboard/parent/children/)
      const { data: children } = await api.get("dashboard/parent/children/");
      const childList = Array.isArray(children) ? children : [];

      if (childList.length === 0) {
        setResults([]);
        return;
      }

      // ✅ Step 2: Fetch results for each child (EXISTS: results/student-results/)
      const resultPromises = childList.map(async (child) => {
        try {
          const res = await api.get(`results/student-results/${child.student_id || child.id}/`);
          return {
            ...child,
            average_score: res.data?.average_score || 0,
            cbc_grade: res.data?.cbc_grade || res.data?.grade || "—"
          };
        } catch {
          // Fallback if no results yet
          return {
            ...child,
            average_score: 0,
            cbc_grade: "—"
          };
        }
      });

      const allResults = await Promise.all(resultPromises);
      setResults(allResults);

    } catch (err) {
      console.error("Failed to load results:", err.response?.status, err.response?.data);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          Failed to load results. Please try again later.
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">CBC Results</h3>
        <p className="text-sm text-gray-500 mt-1">Latest performance for all your children.</p>
      </div>

      {/* Results Table — Responsive */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Class</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Average</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">CBC Grade</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No results available yet.
                  </td>
                </tr>
              ) : (
                results.map((student) => (
                  <tr key={student.student_id || student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          user={{ username: student.first_name, profile_picture: student.photo }}
                          size={36}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Adm: {student.admission_number || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {student.grade} {student.stream}
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {student.average_score ? `${student.average_score}%` : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.cbc_grade}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        to={`/parent/my-children/${student.student_id || student.id}?tab=results`}
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Results
                      </Link>
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

export default ParentResults;