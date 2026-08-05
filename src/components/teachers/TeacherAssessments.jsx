import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";


const TeacherAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAssessments = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(
                "/dashboard/teacher/assessments/"
            );

            setAssessments(response.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load assessments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    const filteredAssessments = useMemo(() => {
        return assessments.filter((assessment) =>
            `${assessment.assessment_type} ${assessment.subject} ${assessment.classroom}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [assessments, search]);

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
                        Failed to Load Assessments
                    </h5>

                    <p className="text-gray-500 text-sm">
                        {error}
                    </p>

                    <button
                        className="mt-3 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition"
                        onClick={fetchAssessments}
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
                        My Assessments
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Create and manage classroom assessments.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="border border-blue-600 text-blue-600 rounded-lg px-4 py-2 text-sm hover:bg-blue-50 transition"
                        onClick={fetchAssessments}
                    >
                        <i className="bi bi-arrow-clockwise mr-2"></i>
                        Refresh
                    </button>

                    <Link
                        to="/teacher/assessments/create"
                        className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition"
                    >
                        <i className="bi bi-plus-circle mr-2"></i>
                        Create Assessment
                    </Link>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="bi bi-journal-check text-blue-600 text-3xl"></i>
                    <h3 className="font-bold text-xl mt-2">
                        {assessments.length}
                    </h3>
                    <span className="text-xs text-gray-500">
                        Total Assessments
                    </span>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="bi bi-calendar-event text-green-600 text-3xl"></i>
                    <h3 className="font-bold text-xl mt-2">
                        {
                            assessments.filter(
                                (a) => a.term === "Term 1"
                            ).length
                        }
                    </h3>
                    <span className="text-xs text-gray-500">
                        Current Term
                    </span>
                </div>

                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="bi bi-building text-yellow-600 text-3xl"></i>
                    <h3 className="font-bold text-xl mt-2">
                        {
                            new Set(
                                assessments.map((a) => a.classroom)
                            ).size
                        }
                    </h3>
                    <span className="text-xs text-gray-500">
                        Classes
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
                            placeholder="Search assessment..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assessment</th>
                                <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                                <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                                <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Term</th>
                                <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="border-b px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {filteredAssessments.length > 0 ? (
                                filteredAssessments.map((assessment) => (
                                    <tr key={assessment.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {assessment.assessment_type}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {assessment.subject}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {assessment.classroom}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {assessment.term}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {assessment.assessment_date}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {assessment.status || "Open"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                to={`/teacher/assessments/${assessment.id}`}
                                                className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-blue-700 transition"
                                            >
                                                Open
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-10"
                                    >
                                        <i className="bi bi-journal-x text-gray-400 text-4xl"></i>
                                        <h5 className="mt-3 font-bold">
                                            No Assessments Found
                                        </h5>
                                        <p className="text-gray-500 text-sm">
                                            No assessments match your search.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
            </div>
        </>
    );
};

export default TeacherAssessments;