import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    filterSubjects();
  }, [search, subjects]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get("subjects/");
      setSubjects(response.data);
      setFilteredSubjects(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubjects = () => {
    let data = [...subjects];

    if (search.trim() !== "") {
      data = data.filter(
        (subject) =>
          subject.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          subject.code
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredSubjects(data);
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject?")) return;

    try {
      await api.delete(`subjects/delete/${id}/`);
      fetchSubjects();
    } catch (error) {
      console.log(error);
      alert("Unable to delete subject.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">
          Loading Subjects...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Subjects
          </h2>

          <Link
            to="/admin/subjects/create"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + Add Subject
          </Link>

        </div>

        <input
          type="text"
          placeholder="Search subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-center">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{subject.code}</td>

                    <td className="p-3 font-medium">
                      {subject.name}
                    </td>

                    <td className="p-3">
                      {subject.description || "-"}
                    </td>

                    <td className="p-3 flex justify-center gap-2">

                      <Link
                        to={`/admin/subjects/edit/${subject.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteSubject(subject.id)}
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
                    colSpan="4"
                    className="text-center py-8 text-gray-500"
                  >
                    No subjects found.
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

export default AdminSubjects;