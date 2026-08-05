import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../UseAvata";
import api from "../api/api";

const ParentReportCard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const response = await api.get(
                "/dashboard/parent/report-cards/"
            );
            // Deduplicate report cards: a report card is unique per
            // (student_id, academic_year, term). Remove any repeated rows.
            const seen = new Map();
            const unique = (response.data || []).filter((report) => {
                const key = `${report.student_id}-${report.academic_year}-${report.term}`;
                if (seen.has(key)) return false;
                seen.set(key, true);
                return true;
            });
            setReports(unique);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <>
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">Report Cards</h3>
                <p className="text-gray-500">View report cards for all your children.</p>                 
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Academic Year</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Term</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Average</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50"><td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <UserAvatar
                                                    user={{
                                                        username: report.first_name,
                                                        profile_picture: report.photo,
                                                    }}
                                                    size={45}
                                                />
                                                <div className="ml-3">
                                                    <div className="font-semibold text-gray-900">
                                                        {report.first_name} {report.last_name}
                                                    </div>
                                                    <small className="text-gray-500">
                                                        {report.grade} {report.stream}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{report.academic_year}</td>
                                        <td className="px-4 py-3 text-gray-600">{report.term}</td>
                                        <td className="px-4 py-3 text-gray-600">{report.average_score}%</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {report.grade_letter}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                to={`/parent/my-children/${report.student_id}?tab=reports`}
                                                className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-xs hover:bg-blue-700 transition inline-flex items-center gap-1"
                                            >
                                                <i className="bi bi-eye-fill"></i>View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
)}
        </>
    );
};
export default ParentReportCard;
