import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filterTeachers = useCallback(() => {
    let data = [...teachers];
    if (search !== "") {
      const q = search.toLowerCase();
      data = data.filter((teacher) =>
        teacher.user.first_name?.toLowerCase().includes(q) ||
        teacher.user.last_name?.toLowerCase().includes(q) ||
        teacher.employee_number?.toLowerCase().includes(q)
      );
    }
    setFilteredTeachers(data);
  }, [teachers, search]);

  useEffect(() => { fetchTeachers(); }, []);
  useEffect(() => { filterTeachers(); }, [filterTeachers]);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("teachers/");
      setTeachers(res.data);
      setFilteredTeachers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await api.delete(`accounts/teachers/delete/${id}/`);
      fetchTeachers();
    } catch (error) {
      console.log(error);
      alert("Unable to delete teacher.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">
          Loading Teachers...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Teachers
          </h2>

          <Link
            to="/admin/register-user"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + Register Teacher
          </Link>

        </div>

        <input
          type="text"
          placeholder="Search teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
        />
                <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-3 text-left">Photo</th>
                <th className="px-4 py-3 text-left">Teacher</th>
                <th className="px-4 py-3 text-left">Employee No</th>
                <th className="px-4 py-3 text-left">National ID</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredTeachers.length > 0 ? (

                filteredTeachers.map((teacher) => (

                  <tr
                    key={teacher.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-4 py-3">

                      <img
                        src={
                          teacher.user.photo
                            ? teacher.user.photo
                            : "/default-avatar.png"
                        }
                        alt=""
                        className="w-12 h-12 rounded-full object-cover border"
                      />

                    </td>

                    <td className="px-4 py-3 font-medium">
                      {teacher.user.first_name}{" "}
                      {teacher.user.last_name}
                    </td>

                    <td className="px-4 py-3">
                      {teacher.employee_number}
                    </td>

                    <td className="px-4 py-3">
                      {teacher.national_id}
                    </td>

                    <td className="px-4 py-3">
                      {teacher.classroom_name || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {teacher.subject_name || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {teacher.user.phone_number}
                    </td>

                    <td className="px-4 py-3">

                      <div className="flex justify-center gap-2">

                        <Link
                          to={`/admin/teachers/edit/${teacher.id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Link>

                        <button
                          onClick={() => deleteTeacher(teacher.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center py-10 text-gray-500"
                  >
                    No teachers found.
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

export default Teachers;