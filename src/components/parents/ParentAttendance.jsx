import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../UseAvata";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-green-600"></div>
  </div>
);

const ParentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      // ✅ Step 1: Get your children list first (this endpoint EXISTS)
      const { data: children } = await api.get("dashboard/parent/children/");
      const childList = Array.isArray(children) ? children : [];

      if (childList.length === 0) {
        setAttendance([]);
        return;
      }

      // ✅ Step 2: Fetch attendance for EACH child (this endpoint EXISTS)
      const attendancePromises = childList.map(async (child) => {
        try {
          const res = await api.get(`attendance/student/${child.student_id || child.id}/`);
          return {
            ...child,
            present: res.data?.present || 0,
            absent: res.data?.absent || 0,
            excused: res.data?.excused || 0,
            attendance_percentage: res.data?.attendance_percentage || 0
          };
        } catch {
          // If attendance fails for one child, still show their basic info
          return {
            ...child,
            present: 0,
            absent: 0,
            excused: 0,
            attendance_percentage: 0
          };
        }
      });

      const allAttendance = await Promise.all(attendancePromises);
      setAttendance(allAttendance);

    } catch (err) {
      console.error("Failed to load attendance:", err.response?.status, err.response?.data);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          Failed to load attendance records. Please try again later.
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Attendance</h3>
        <p className="text-sm text-gray-500 mt-1">Attendance summary for all your children.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {attendance.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4">
              No attendance records found for your children yet.
            </div>
          </div>
        ) : (
          attendance.map((child) => (
            <div
              key={child.student_id || child.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-shadow hover:shadow"
            >
              <div className="flex items-center mb-4">
                <UserAvatar
                  user={{ username: child.first_name, profile_picture: child.photo }}
                  size={55}
                />
                <div className="ml-3">
                  <h5 className="font-bold text-gray-800">
                    {child.first_name} {child.last_name}
                  </h5>
                  <p className="text-sm text-gray-500">
                    {child.grade} {child.stream}
                  </p>
                </div>
              </div>

              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 bg-gray-50 w-2/5">Present</th>
                    <td className="px-4 py-3 text-gray-800 font-medium">{child.present}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 bg-gray-50">Absent</th>
                    <td className="px-4 py-3 text-gray-800 font-medium">{child.absent}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 bg-gray-50">Excused</th>
                    <td className="px-4 py-3 text-gray-800 font-medium">{child.excused}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 bg-gray-50">Attendance Rate</th>
                    <td className="px-4 py-3 flex items-center justify-between">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {child.attendance_percentage}%
                      </span>
                      <Link
                        to={`/parent/my-children/${child.student_id || child.id}?tab=attendance`}
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParentAttendance;