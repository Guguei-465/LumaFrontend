import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [search, assignments]);

  const fetchAssignments = async () => {
    try {
      const response = await api.get("assignments/");
      setAssignments(response.data);
      setFilteredAssignments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let data = [...assignments];

    if (search.trim() !== "") {
      data = data.filter(
        (assignment) =>
          assignment.teacher_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          assignment.subject_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          assignment.classroom_name
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredAssignments(data);
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      await api.delete(`assignments/delete/${id}/`);
      fetchAssignments();
    } catch (error) {
      console.log(error);
      alert("Unable to delete assignment.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">
          Loading Assignments...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Teacher Assignments
          </h2>

          <Link
            to="/admin/assignments/create"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + New Assignment
          </Link>

        </div>

        <input
          type="text"
          placeholder="Search assignment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3 text-left">Teacher</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Academic Year</th>
                <th className="p-3 text-left">Term</th>
                <th className="p-3 text-left">Class Teacher</th>
                <th className="p-3 text-center">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {assignment.teacher_name}
                    </td>

                    <td className="p-3">
                      {assignment.subject_name}
                    </td>

                    <td className="p-3">
                      {assignment.classroom_name}
                    </td>

                    <td className="p-3">
                      {assignment.academic_year}
                    </td>

                    <td className="p-3">
                      {assignment.term}
                    </td>

                    <td className="p-3">
                      {assignment.is_class_teacher ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          No
                        </span>
                      )}
                    </td>

                    <td className="p-3 flex justify-center gap-2">

                      <Link
                        to={`/admin/assignments/edit/${assignment.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteAssignment(assignment.id)}
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
                    No assignments found.
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

export default Assignments;