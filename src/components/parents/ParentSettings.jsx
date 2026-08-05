import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
  </div>
);

const ParentSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleUpdateProfile = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch("/dashboard/parent/profile/", {
        email: formData.email,
        phone_number: formData.phone_number,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleChangePassword = useCallback(async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      alert("New passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await api.post("/dashboard/parent/change-password/", {
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      alert("Password updated successfully!");
      setFormData({ ...formData, current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.error("Password change failed:", err);
      alert("Failed to change password. Check your current password.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Update your account details and password.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Update Contact Info</h4>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Spinner /> : saved ? "✓ Saved" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h4>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
              <input
                type="password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Spinner /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParentSettings;