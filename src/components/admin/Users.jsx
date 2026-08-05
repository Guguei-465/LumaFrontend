import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const filterUsers = useCallback(() => {
    let data = [...users];

    if (search !== "") {
      data = data.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
          user.username?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "") {
      data = data.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(data);
  }, [search, roleFilter, users]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("accounts/users/");

      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`accounts/users/delete/${id}/`);

      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Unable to delete user.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg font-semibold text-gray-600">
          Loading Users...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            System Users
          </h2>

          <Link
            to="/admin/register-user"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            + Register User
          </Link>

        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ACADEMIC_COORDINATOR">Academic Coordinator</option>
            <option value="ACCOUNTANT">Accountant</option>
            <option value="TEACHER">Teacher</option>
            <option value="PARENT">Parent</option>
          </select>

        </div>
                <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-gray-100 text-left">

                <th className="p-3">Photo</th>
                <th className="p-3">Name</th>
                <th className="p-3">Username</th>
                <th className="p-3">Role</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">

                      <img
                        src={
                          user.photo
                            ? user.photo
                            : "/default-avatar.png"
                        }
                        alt=""
                        className="w-12 h-12 rounded-full object-cover border"
                      />

                    </td>

                    <td className="p-3 font-medium">
                      {user.first_name} {user.last_name}
                    </td>

                    <td className="p-3">
                      {user.username}
                    </td>

                    <td className="p-3">

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">

                        {user.role.replaceAll("_", " ")}

                      </span>

                    </td>

                    <td className="p-3">
                      {user.email}
                    </td>

                    <td className="p-3">
                      {user.phone_number}
                    </td>

                    <td className="p-3">

                      <div className="flex justify-center gap-2">

                        <Link
                          to={`/admin/users/edit/${user.id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Link>

                        <button
                          onClick={() => deleteUser(user.id)}
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
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    No users found.
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

export default Users;