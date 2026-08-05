import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";


const TeachingAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAssignments = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await api.get("assignments/");
            console.log(res)
            setAssignments(res.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const filteredAssignments = useMemo(() => {
        return assignments.filter((assignment) =>
            `${assignment.subject} ${assignment.grade} ${assignment.stream}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [assignments, search]);

    const totalStudents = assignments.reduce(
        (sum, assignment) => sum + assignment.students,
        0
    );

    const classTeacherAssignments = assignments.filter(
        (assignment) => assignment.class_teacher
    ).length;

    if (loading) {
        return (
            <div className="flex justify-center py-5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow">
                <div className="text-center py-10 px-6">
                    <i className="bi bi-exclamation-circle text-red-500 text-4xl"></i>
                    <h5 className="mt-3 font-bold">
                        Failed to Load Assignments
                    </h5>
                    <p className="text-gray-500 text-sm">
                        {error}
                    </p>
                    <button
                        className="mt-3 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition"
                        onClick={fetchAssignments}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div>
                    <h3 className="font-bold text-lg mb-1">
                        Teaching Assignments
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Manage your assigned subjects and classes.
                    </p>
                </div>

                <button
                    className="border border-blue-600 text-blue-600 rounded-lg px-4 py-2 text-sm hover:bg-blue-50 transition"
                    onClick={fetchAssignments}
                >
                    <i className="bi bi-arrow-clockwise mr-2"></i>
                    Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="bi bi-journal-bookmark-fill text-blue-600 text-3xl"></i>
                    <h3 className="font-bold text-xl mt-2">
                        {assignments.length}
                    </h3>
                    <span className="text-xs text-gray-500">
                        Assignments
                    </span>
                </div>

                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="bi bi-people-fill text-green-600 text-3xl"></i>
                    <h3 className="font-bold text-xl mt-2">
                        {totalStudents}
                    </h3>
                    <span className="text-xs text-gray-500">
                        Total Students
                    </span>
                </div>

                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="bi bi-person-check-fill text-yellow-600 text-3xl"></i>
                    <h3 className="font-bold text-xl mt-2">
                        {classTeacherAssignments}
                    </h3>
                    <span className="text-xs text-gray-500">
                        Class Teacher Roles
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow mb-4">
                <div className="p-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <span className="px-3 text-gray-500">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="w-full py-2 pr-3 text-sm focus:outline-none"
                            placeholder="Search subject, grade or stream..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {filteredAssignments.length === 0 ? (
                <div className="bg-white rounded-xl shadow">
                    <div className="text-center py-10 px-6">
                        <i className="bi bi-journal-x text-gray-400 text-4xl"></i>
                        <h5 className="mt-3 font-bold">
                            No Assignments Found
                        </h5>
                        <p className="text-gray-500 text-sm">
                            You don't have any teaching assignments matching your search.
                        </p>
                    </div>
                </div>
            ) : (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredAssignments.map((assignment) => (
                        <div
                            key={assignment.id}
                        >
                            <div className="bg-white rounded-xl shadow h-full">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-bold">
                                                {assignment.subject}
                                            </h5>
                                            <p className="text-gray-500 text-sm mb-1">
                                                {assignment.grade} • {assignment.stream}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                <i className="bi bi-people-fill mr-2"></i>
                                                {assignment.students} Students
                                            </span>
                                        </div>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                assignment.class_teacher
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {assignment.class_teacher
                                                ? "Class Teacher"
                                                : "Subject Teacher"}
                                        </span>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            to={`/teacher/assignments/${assignment.id}`}
                                            className="border border-gray-800 text-gray-800 rounded-lg px-4 py-2 text-sm text-center hover:bg-gray-50 transition"
                                        >
                                            <i className="bi bi-eye mr-2"></i>
                                            Assignment Details
                                        </Link>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Link
                                                    to={`/teacher/assignments/${assignment.id}/students`}
                                                    className="block bg-blue-600 text-white rounded-lg px-4 py-2 text-sm text-center hover:bg-blue-700 transition"
                                                >
                                                    Students
                                                </Link>
                                            </div>

                                            <div>
                                                <Link
                                                    to={`/teacher/assignments/${assignment.id}/results`}
                                                    className="block bg-green-600 text-white rounded-lg px-4 py-2 text-sm text-center hover:bg-green-700 transition"
                                                >
                                                    Results
                                                </Link>
                                            </div>

                                            {assignment.class_teacher && (
                                                <div className="col-span-2">
                                                    <Link
                                                        to={`/teacher/assignments/${assignment.id}/attendance`}
                                                        className="block bg-yellow-500 text-white rounded-lg px-4 py-2 text-sm text-center hover:bg-yellow-600 transition"
                                                    >
                                                        <i className="bi bi-calendar-check-fill mr-2"></i>
                                                        Attendance
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default TeachingAssignments;

