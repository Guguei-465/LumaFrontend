import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
 

const TeacherDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [todayLessons, setTodayLessons] = useState([]);

    const navigate = useNavigate();

    const fetchTodayLessons = async () => {
        try {
            const { data } = await api.get(
                "/timetable/my-timetable/"
            );

            const today = new Date().toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                }
            );

            const lessons = data.filter(
                lesson => lesson.day === today
            );

            setTodayLessons(lessons);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDashboard = async () => {
        try {
            const { data } = await api.get("/dashboard/teacher/");
            setDashboard(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        fetchTodayLessons();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-80">
                <div className="text-lg font-semibold">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Welcome */}
            <div className="bg-white rounded-xl shadow p-6">
                <h1 className="text-xl font-bold text-gray-800">
                    Good Morning, {dashboard.teacher_name}
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Welcome back to your teaching dashboard.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="bg-blue-600 text-white rounded-xl p-4 shadow">
                    <h3 className="text-xs uppercase tracking-wider">
                        Assigned Classes
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                        {dashboard.assigned_classes}
                    </p>
                </div>

                <div className="bg-green-600 text-white rounded-xl p-4 shadow">
                    <h3 className="text-xs uppercase tracking-wider">
                        Assigned Subjects
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                        {dashboard.assigned_subjects}
                    </p>
                </div>

                <div className="bg-purple-600 text-white rounded-xl p-4 shadow">
                    <h3 className="text-xs uppercase tracking-wider">
                        Total Students
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                        {dashboard.total_students}
                    </p>
                </div>

                <div
                    className="bg-white rounded-xl p-4 shadow cursor-pointer hover:shadow-lg transition flex flex-col items-center justify-center"
                    onClick={() => navigate("/teacher/timetable")}
                >
                    <p className="text-xs text-gray-500">Today's Lessons</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {dashboard?.today_lessons ?? 0}
                    </p>
                    <span className="text-xs text-blue-600 mt-1">
                        View timetable →
                    </span>
                </div>

                <div className="bg-red-600 text-white rounded-xl p-4 shadow">
                    <h3 className="text-xs uppercase tracking-wider">
                        Pending Results
                    </h3>
                    <p className="text-2xl font-bold mt-2">
                        {dashboard.pending_results}
                    </p>
                </div>

                <div className="bg-indigo-600 text-white rounded-xl p-4 shadow">
                    <h3 className="text-xs uppercase tracking-wider">
                        Class Teacher
                    </h3>
                    <p className="text-xl font-bold mt-2">
                        {dashboard.is_class_teacher ? "YES" : "NO"}
                    </p>
                </div>
            </div>

            {/* Today's Timetable */}
            <div className="bg-white rounded-xl shadow">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-bold">
                        Today's Timetable
                    </h2>
                </div>

                <div className="p-6">
                    {todayLessons.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No lessons scheduled today.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {todayLessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50"
                                >
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {lesson.subject}
                                        </h3>
                                        <p className="text-gray-500">
                                            {lesson.classroom}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold">
                                            {lesson.start_time}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {lesson.end_time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-bold">
                        Quick Actions
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                    <Link
                        to="/teacher/attendance"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 font-semibold transition"
                    >
                        <i className="bi bi-marked"/>Mark Attendance
                    </Link>

                    <Link
                        to="/teacher/assessments"
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 font-semibold transition"
                    >
                        <i className="bi bi-marked"/> Enter Assessment Marks
                    </Link>

                    <Link
                        to="/teacher/students"
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-4 font-semibold transition"
                    >
                        <i className="bi bi-marked"/>View Students
                    </Link>

                    <Link
                        to="/teacher/timetable"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg p-4 font-semibold transition"
                    >
                        <i className="bi bi-marked"/>My Timetable
                    </Link>

                    <Link
                        to="/teacher/profile"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-4 font-semibold transition"
                    >
                        <i className="bi bi-marked"/> My Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;

