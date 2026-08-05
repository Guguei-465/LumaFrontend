import { useEffect, useState } from "react";
import api from "../api/api";

const LearningOutcomes = () => {
  const [outcomes, setOutcomes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOutcomes = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await api.get(
        "results/learning-outcomes/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOutcomes(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);

  useEffect(() => {
    const data = outcomes.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFiltered(data);
  }, [search, outcomes]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Learning Outcomes
            </h2>
            <p className="text-gray-500">
              Manage CBC learning outcomes.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            <i className="bi bi-plus-circle-fill"></i>
            Add Outcome
          </button>
        </div>

        <div className="relative mb-6">
          <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>

          <input
            type="text"
            placeholder="Search learning outcomes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-6">
                    No learning outcomes found.
                  </td>
                </tr>
              ) : (
                filtered.map((outcome) => (
                  <tr
                    key={outcome.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {outcome.title || outcome.name}
                    </td>

                    <td className="px-4 py-3">
                      {outcome.description}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-3">
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
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

export default LearningOutcomes;