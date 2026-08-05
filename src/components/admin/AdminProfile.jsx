import React, { useEffect, useState } from "react";
import api from "../api/api";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/accounts/me/");
      setProfile(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">
          Loading Profile...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

        <div className="bg-gradient-to-r from-green-700 to-blue-800 h-40"></div>

        <div className="px-8 pb-8">

          <div className="-mt-16 flex flex-col md:flex-row items-center md:items-end gap-6">

            {profile?.photo ? (
              <img
                src={profile.photo}
                alt="Admin"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center shadow-lg">
                <i className="bi bi-person-fill text-6xl text-gray-600"></i>
              </div>
            )}

            <div className="flex-1 text-center md:text-left">

              <h2 className="text-3xl font-bold">
                {profile?.first_name} {profile?.last_name}
              </h2>

              <p className="text-gray-600">
                {profile?.role}
              </p>

              <span className="inline-block mt-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                Administrator
              </span>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="bg-gray-50 rounded-lg p-5">

              <h3 className="font-bold text-lg mb-4">
                Personal Information
              </h3>

              <div className="space-y-3">

                <p>
                  <strong>Full Name:</strong><br />
                  {profile?.first_name} {profile?.last_name}
                </p>

                <p>
                  <strong>Email:</strong><br />
                  {profile?.email}
                </p>

                <p>
                  <strong>Phone:</strong><br />
                  {profile?.phone_number || "N/A"}
                </p>

                <p>
                  <strong>Role:</strong><br />
                  {profile?.role}
                </p>

              </div>

            </div>

            <div className="bg-gray-50 rounded-lg p-5">

              <h3 className="font-bold text-lg mb-4">
                Account Details
              </h3>

              <div className="space-y-3">

                <p>
                  <strong>Username:</strong><br />
                  {profile?.username}
                </p>

                <p>
                  <strong>Status:</strong><br />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      profile?.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {profile?.is_active ? "Active" : "Inactive"}
                  </span>
                </p>

                <p>
                  <strong>Date Joined:</strong><br />
                  {profile?.date_joined
                    ? new Date(profile.date_joined).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  <strong>Last Login:</strong><br />
                  {profile?.last_login
                    ? new Date(profile.last_login).toLocaleString()
                    : "Never"}
                </p>

              </div>

            </div>

          </div>

          <div className="mt-8 flex gap-4">

            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
              Edit Profile
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Change Password
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminProfile;