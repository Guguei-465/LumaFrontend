import React, { useEffect, useState } from "react";
import api from "../api/api";


const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("reports/");
      setReports(response.data);
      setFilteredReports(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = React.useCallback(() => {
    let data = [...reports];

    if (search.trim() !== "") {
      data = data.filter(
        (report) =>
          report.student_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          report.classroom
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          report.term
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredReports(data);
  }, [reports, search]);

  useEffect(() => {
    filterReports();
  }, [filterReports]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">
          Loading Reports...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Academic Reports
          </h2>

        </div>

        <input
          type="text"
          placeholder="Search report..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Term</th>
                <th className="p-3 text-left">Academic Year</th>
                <th className="p-3 text-left">Average</th>
                <th className="p-3 text-left">Grade</th>
                <th className="p-3 text-center">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {report.student_name}
                    </td>

                    <td className="p-3">
                      {report.classroom}
                    </td>

                    <td className="p-3">
                      {report.term}
                    </td>

                    <td className="p-3">
                      {report.academic_year}
                    </td>

                    <td className="p-3">
                      {report.average}%
                    </td>

                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                        {report.grade}
                      </span>
                    </td>

                    <td className="p-3 flex justify-center gap-2">

                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Print
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
                    No reports available.
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

export default Reports;