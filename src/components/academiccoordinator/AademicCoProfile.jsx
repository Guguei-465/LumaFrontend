import React, { useEffect, useState } from "react";
import api from "../api/api";

const AcademicCoProfile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    department: "",
    role: "",
  });
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("users/profile/");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setMessage({ text: "Could not load profile data.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setMessage({ text: "", type: "" });
    try {
      await api.put("users/profile/", profile);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      console.error("Update failed:", err);
      setMessage({ text: err.response?.data?.detail || "Failed to update profile.", type: "error" });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setUpdatingPassword(true);
    setMessage({ text: "", type: "" });

    if (passwords.new_password !== passwords.confirm_password) {
      setMessage({ text: "New passwords do not match!", type: "error" });
      setUpdatingPassword(false);
      return;
    }

    try {
      await api.post("users/change-password/", {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });
      setMessage({ text: "Password changed successfully!", type: "success" });
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.error("Password change failed:", err);
      setMessage({ text: err.response?.data?.detail || "Failed to change password.", type: "error" });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your personal information and account security
        </p>
      </div>

      {/* Status Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Personal Information Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="form-lable">First Name</label>
              <input
                type="text"
                name="first_name"
                value={profile.first_name}
                onChange={handleProfileChange}
                className="milk-input"
                required
              />
            </div>
            <div>
              <label className="form-lable">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={profile.last_name}
                onChange={handleProfileChange}
                className="milk-input"
                required
              />
            </div>
            <div>
              <label className="form-lable">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="milk-input"
                required
              />
            </div>
            <div>
              <label className="form-lable">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={profile.phone_number}
                onChange={handleProfileChange}
                className="milk-input"
              />
            </div>
            <div>
              <label className="form-lable">Department</label>
              <input
                type="text"
                name="department"
                value={profile.department}
                onChange={handleProfileChange}
                className="milk-input"
                readOnly
              />
            </div>
            <div>
              <label className="form-lable">Role</label>
              <input
                type="text"
                name="role"
                value={profile.role}
                className="milk-input"
                readOnly
              />
            </div>
            <button
              type="submit"
              className="milk-btn w-full"
              disabled={updatingProfile}
            >
              {updatingProfile ? "Saving Changes..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="form-lable">Current Password</label>
              <input
                type="password"
                name="old_password"
                value={passwords.old_password}
                onChange={handlePasswordChange}
                className="milk-input"
                required
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="form-lable">New Password</label>
              <input
                type="password"
                name="new_password"
                value={passwords.new_password}
                onChange={handlePasswordChange}
                className="milk-input"
                required
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="form-lable">Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                value={passwords.confirm_password}
                onChange={handlePasswordChange}
                className="milk-input"
                required
                placeholder="Repeat new password"
              />
            </div>
            <button
              type="submit"
              className="milk-btn w-full"
              disabled={updatingPassword}
            >
              {updatingPassword ? "Updating Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AcademicCoProfile;