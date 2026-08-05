import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    const filtered = students.filter((s) =>
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  const fetchStudents = async () => {
    try {
      const response = await api.get("students/");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete(`students/delete/${id}/`);
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500 mt-1">Manage all registered students</p>
        </div>
        <Link
          to="/admin/register-student"
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow transition"
        >
          <i className="bi bi-plus-circle-fill"></i> Add Student
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="relative">
          <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search student..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading students...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Admission No</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                    <td className="px-4 py-3">{student.admission_number}</td>
                    <td className="px-4 py-3">{student.classroom_name}</td>
                    <td className="px-4 py-3">{student.gender}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {student.status || "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleDelete(student.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-10 text-gray-500">No students found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
