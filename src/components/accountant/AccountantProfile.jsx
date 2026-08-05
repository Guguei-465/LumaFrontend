import React from "react";
import { useState } from "react";

const AccountantProfile = () => {
  const [profile] = useState({
    first_name: "Jane",
    last_name: "Doe",
    email: "accountant@luma2000.ac.ke",
    phone: "+254712345678",
    employee_number: "ACC001",
    role: "Accountant",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 mt-1">
          View your account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center text-5xl text-green-700">
            <i className="bi bi-person-fill"></i>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">First Name</label>
              <p className="font-semibold">{profile.first_name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Last Name</label>
              <p className="font-semibold">{profile.last_name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-semibold">{profile.email}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="font-semibold">{profile.phone}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Employee Number</label>
              <p className="font-semibold">{profile.employee_number}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Role</label>
              <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Account Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-green-600 font-semibold">Active</p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-semibold">Finance</p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Access Level</p>
            <p className="font-semibold">Accountant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantProfile;