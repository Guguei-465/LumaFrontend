import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UserAvatar from "../UseAvata";

const ParentProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h5 className="text-xl font-bold text-gray-800">My Profile</h5>
        <p className="text-sm text-gray-500 mt-1">Your account information.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar user={user} size={65} />
          <div>
            <h5 className="text-lg font-bold text-gray-800">
              {user?.first_name} {user?.last_name}
            </h5>
            <p className="text-sm text-gray-500">Parent</p>
          </div>
        </div>

        {/* Details Table */}
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase bg-gray-50 w-1/3">
                Username
              </th>
              <td className="px-4 py-3 text-gray-900">{user?.username || "—"}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                Email
              </th>
              <td className="px-4 py-3 text-gray-900">{user?.email || "—"}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                Phone
              </th>
              <td className="px-4 py-3 text-gray-900">{user?.phone_number || "—"}</td>
            </tr>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                Role
              </th>
              <td className="px-4 py-3 text-gray-900 capitalize">{user?.role || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParentProfile;