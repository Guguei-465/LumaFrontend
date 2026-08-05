import { useEffect, useState } from "react";
import api from "../api/api";

const AcademicCoProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await api.get(
        "accounts/me/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">

        <div className="flex flex-col md:flex-row items-center gap-6">

          <img
            src={
              profile.profile_image ||
              "https://ui-avatars.com/api/?name=Academic+Coordinator"
            }
            alt="Profile"
            className="w-36 h-36 rounded-full border-4 border-blue-100 object-cover"
          />

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {profile.first_name} {profile.last_name}
            </h2>

            <p className="text-blue-600 font-medium">
              Academic Coordinator
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="flex items-center gap-3">
          <i className="bi bi-person-fill text-blue-600"></i>
            <span>{profile.username}</span>
          </div>

          <div className="flex items-center gap-3">
          <i className="bi bi-envelope-fill text-blue-600"></i>
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center gap-3">
          <i className="bi bi-telephone-fill text-blue-600"></i>
            <span>{profile.phone_number || "Not Available"}</span>
          </div>

          <div className="flex items-center gap-3">
          <i className="bi bi-shield-fill text-blue-600"></i>
            <span>{profile.role}</span>
          </div>

          <div className="flex items-center gap-3">
          <i className="bi bi-calendar-fill text-blue-600"></i>
            <span>
              Joined:{" "}
              {profile.date_joined
                ? new Date(profile.date_joined).toLocaleDateString()
                : "-"}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AcademicCoProfile;