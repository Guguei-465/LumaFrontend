import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("classes/");
      setClasses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      await api.delete(`classes/delete/${id}/`);
      fetchClasses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Classes
        </h1>

        <Link
          to="/admin/classes/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Class
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-left">Stream</th>
              <th className="p-3 text-left">Capacity</th>
              <th className="p-3 text-left">Class Teacher</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No classes found.
                </td>
              </tr>
            ) : (
              classes.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{item.grade}</td>
                  <td className="p-3">{item.stream}</td>
                  <td className="p-3">{item.capacity}</td>
                  <td className="p-3">
                    {item.class_teacher_name || "Not Assigned"}
                  </td>

                  <td className="p-3 flex justify-center gap-2">
                    <Link
                      to={`/admin/classes/edit/${item.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteClass(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classes;