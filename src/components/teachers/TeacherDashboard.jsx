import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const ButtonSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
);

const TeacherDashboard = () => {
  const [dashboard, setDashboard] = useState({});
  const [todayLessons, setTodayLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navigating, setNavigating] = useState(null);
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("dashboard/teacher/");
      setDashboard(data || {});
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTodayLessons = useCallback(async () => {
    try {
      const { data } = await api.get("timetable/my-timetable/");
      const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const lessons = Array.isArray(data)
        ? data.filter(lesson => String(lesson.day).toLowerCase() === todayName.toLowerCase())
        : [];
      setTodayLessons(lessons);
    } catch (err) {
      console.error("Timetable error:", err);
      setTodayLessons([]);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchTodayLessons();
  }, [fetchDashboard, fetchTodayLessons]);

  const handleNavigate = (path, label) => {
    setNavigating(label);
    setTimeout(() => navigate(path), 200);
  };

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      </div>
    );

  const d = dashboard || {};
  const teacher_name = d.teacher_name || "Teacher";
  const assigned_classes = Number(d.assigned_classes ?? 0);
  const assigned_subjects = Number(d.assigned_subjects ?? 0);
  const total_students = Number(d.total_students ?? 0);
  const pending_results = Number(d.pending_results ?? 0);
  const is_class_teacher = Boolean(d.is_class_teacher);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="card">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Good Morning, {teacher_name}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Welcome back to your teaching dashboard.
        </p>
      </div>

      {/* Statistics Cards — Using your stat-card class */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="stat-card py-6">
          <p className="text-sm text-gray-600 uppercase tracking-wider">Assigned Classes</p>
          <p className="stat-value mt-2">{assigned_classes}</p>
        </div>

        <div className="stat-card py-6">
          <p className="text-sm text-gray-600 uppercase tracking-wider">Assigned Subjects</p>
          <p className="stat-value mt-2">{assigned_subjects}</p>
        </div>

        <div className="stat-card py-6">
          <p className="text-sm text-gray-600 uppercase tracking-wider">Total Students</p>
          <p className="stat-value mt-2">{total_students}</p>
        </div>

        <button
          className="stat-card py-6 text-left w-full hover:shadow-md transition"
          onClick={() => handleNavigate("/teacher/timetable", "timetable")}
          disabled={navigating === "timetable"}
        >
          <p className="text-sm text-gray-600 uppercase tracking-wider">Today's Lessons</p>
          <p className="stat-value mt-2">
            {navigating === "timetable" ? <ButtonSpinner /> : todayLessons.length}
          </p>
          <p className="text-xs text-green-600 mt-2 font-medium">View timetable →</p>
        </button>

        <div className="stat-card py-6">
          <p className="text-sm text-gray-600 uppercase tracking-wider">Pending Results</p>
          <p className="stat-value mt-2">{pending_results}</p>
        </div>

        <div className="stat-card py-6">
          <p className="text-sm text-gray-600 uppercase tracking-wider">Class Teacher</p>
          <p className="stat-value mt-2">{is_class_teacher ? "YES" : "NO"}</p>
        </div>
      </div>

      {/* Today's Timetable */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Timetable</h2>

        {todayLessons.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No lessons scheduled today.
          </div>
        ) : (
          <div className="space-y-3">
            {todayLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{lesson.subject || "—"}</h3>
                  <p className="text-sm text-gray-500">{lesson.classroom || "—"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-medium text-gray-700">
                    {lesson.start_time || "—"} – {lesson.end_time || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions — Using your milk-btn + loading state */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <button
            className="milk-btn"
            onClick={() => handleNavigate("/teacher/attendance", "attendance")}
            disabled={!!navigating}
          >
            {navigating === "attendance" && <ButtonSpinner />}
            Mark Attendance
          </button>

          <button
            className="milk-btn"
            onClick={() => handleNavigate("/teacher/assessments", "assessments")}
            disabled={!!navigating}
          >
            {navigating === "assessments" && <ButtonSpinner />}
            Enter Assessment Marks
          </button>

          <button
            className="milk-btn"
            onClick={() => handleNavigate("/teacher/students", "students")}
            disabled={!!navigating}
          >
            {navigating === "students" && <ButtonSpinner />}
            View Students
          </button>

          <button
            className="milk-btn"
            onClick={() => handleNavigate("/teacher/timetable", "timetable")}
            disabled={!!navigating}
          >
            {navigating === "timetable" && <ButtonSpinner />}
            My Timetable
          </button>

          <button
            className="milk-btn"
            onClick={() => handleNavigate("/teacher/profile", "profile")}
            disabled={!!navigating}
          >
            {navigating === "profile" && <ButtonSpinner />}
            My Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;