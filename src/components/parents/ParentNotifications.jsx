import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-green-600"></div>
  </div>
);

const ParentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      // ✅ EXACT PATHS FROM YOUR BACKEND (with their typos)
      const [annRes, notifRes] = await Promise.all([
        api.get("/anouncements/"),
        api.get("/notifiations/")
      ]);

      // ✅ FORCE ARRAY — fixes "map is not a function" error
      setAnnouncements(Array.isArray(annRes.data) ? annRes.data : []);
      setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
    } catch (err) {
      console.error("Load error details:", err.response?.status, err.response?.data);
      setError(true);
      setAnnouncements([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
        Failed to load updates. Please try again later.
      </div>
    );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Updates & Notifications</h3>
        <p className="text-sm text-gray-500 mt-1">School announcements and personal alerts.</p>
      </div>

      {/* 📢 Announcements */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Announcements</h4>
        {announcements.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 rounded-lg p-4">
            No announcements available yet.
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-blue-400 p-4 transition-all hover:shadow"
              >
                <h5 className="font-semibold text-gray-800">{item.title}</h5>
                <p className="text-gray-600 text-sm mt-1">{item.message}</p>
                <small className="text-gray-400 mt-2 block">Posted {item.created_at}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔔 Notifications */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Your Notifications</h4>
        {notifications.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4">
            No personal notifications at the moment.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 p-4 transition-all hover:shadow ${
                  item.is_read ? "border-l-gray-400 opacity-90" : "border-l-green-500"
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800 mb-1">{item.title}</h5>
                    <p className="text-gray-600 text-sm mb-2">{item.message}</p>
                    <small className="text-gray-400">{item.created_at}</small>
                  </div>
                  {!item.is_read && (
                    <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentNotifications;