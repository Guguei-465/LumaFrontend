import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";



const PendingAttendance = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPendingAttendance();
    }, []);

    const fetchPendingAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const { data } = await api.get(
                "/attendance/pending/"
            );

            setSubmissions(data);

        } catch (err) {
            console.error(err);
            setError("Failed to load pending attendance.");

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <h3 className="text-base font-semibold">
                    Loading pending attendance...
                </h3>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">
                        Pending Attendance
                    </h2>
                    <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
                        {submissions.length} Pending
                    </span>
                </div>
                    
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Class
                                </th>
                                <th className="border px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="border px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Submitted By
                                </th>
                                <th className="border px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Submitted At
                                </th>
                                <th className="border px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="border px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No pending attendance found.
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((submission) => (
                                    <tr
                                        key={submission.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="border px-4 py-3 font-medium text-sm">
                                            {submission.classroom}
                                        </td>
                                        <td className="border px-4 py-3 text-sm">
                                            {submission.date}
                                        </td>
                                        <td className="border px-4 py-3 text-sm">
                                            {submission.submitted_by}
                                        </td>
                                        <td className="border px-4 py-3 text-sm">
                                            {submission.submitted_at}
                                        </td>
                                        <td className="border px-4 py-3 text-center">
                                            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                                {submission.approval_status}
                                            </span>
                                        </td>
                                        <td className="border px-4 py-3 text-center">
                                            <Link
                                                to={`/attendance/pending/${submission.id}`}
                                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                            >
                                                View
                                            </Link>
                                      </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PendingAttendance;
