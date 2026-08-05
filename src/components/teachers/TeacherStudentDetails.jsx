import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";


const TeacherStudentDetails = () => {
    const { id } = useParams();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await api.get(`/dashboard/teacher/students/${id}/`);
                setStudent(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load student details.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow">
                <div className="text-center py-10 px-6">
                    <i className="bi bi-exclamation-circle text-red-500 text-3xl"></i>
                    <h5 className="mt-3 font-bold text-sm">Unable to Load Student</h5>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <button
                        className="mt-3 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="bg-white rounded-xl shadow">
                <div className="text-center py-10 px-6">
                    <i className="bi bi-person-x text-gray-400 text-3xl"></i>
                    <h5 className="mt-3 font-bold text-sm">Student Not Found</h5>
                    <p className="text-gray-500 text-sm">The requested student could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                {student.photo ? (
                    <img
                        src={student.photo}
                        alt={student.student_name}
                        width="72"
                        height="72"
                        className="rounded-full object-cover border"
                    />
                ) : (
                    <div
                        className="bg-blue-600 rounded-full flex justify-center items-center text-white font-bold"
                        style={{ width: 72, height: 72, fontSize: 28 }}
                    >
                        {student.student_name?.charAt(0)}
                    </div>
                )}

                <div>
                    <h3 className="font-bold text-base mb-1">{student.student_name}</h3>
                    <p className="text-gray-500 text-sm">
                        Admission: {student.admission_number}
                    </p>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            student.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {student.status}
                    </span>
                </div>
            </div>

            {/* Student Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow">
                    <div className="border-b px-6 py-4">
                        <h5 className="font-bold text-sm">Personal Information</h5>
                    </div>
                    <div className="p-4">
                        <table className="min-w-full">
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500" style={{ width: "140px" }}>Full Name</td>
                                    <td className="py-2 text-sm font-medium">{student.student_name}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">Admission No.</td>
                                    <td className="py-2 text-sm font-medium">{student.admission_number}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">Gender</td>
                                    <td className="py-2 text-sm font-medium">{student.gender}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">Date of Birth</td>
                                    <td className="py-2 text-sm font-medium">{student.date_of_birth || "—"}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-xs text-gray-500">Status</td>
                                    <td className="py-2">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                student.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow">
                    <div className="border-b px-6 py-4">
                        <h5 className="font-bold text-sm">Academic Information</h5>
                    </div>
                    <div className="p-4">
                        <table className="min-w-full">
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500" style={{ width: "140px" }}>Class</td>
                                    <td className="py-2 text-sm font-medium">{student.classroom || "—"}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">Grade</td>
                                    <td className="py-2 text-sm font-medium">{student.grade || "—"}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">Stream</td>
                                    <td className="py-2 text-sm font-medium">{student.stream || "—"}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-xs text-gray-500">Enrollment Date</td>
                                    <td className="py-2 text-sm font-medium">{student.enrollment_date || "—"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow">
                    <div className="border-b px-6 py-4">
                        <h5 className="font-bold text-sm">Contact Information</h5>
                    </div>
                    <div className="p-4">
                        <table className="min-w-full">
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500" style={{ width: "140px" }}>Parent/Guardian</td>
                                    <td className="py-2 text-sm font-medium">{student.parent_name || "—"}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">Parent Contact</td>
                                    <td className="py-2 text-sm font-medium">{student.parent_phone || "—"}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">Parent Email</td>
                                    <td className="py-2 text-sm font-medium">{student.parent_email || "—"}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-xs text-gray-500">Address</td>
                                    <td className="py-2 text-sm font-medium">{student.address || "—"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow">
                    <div className="border-b px-6 py-4">
                        <h5 className="font-bold text-sm">Performance Summary</h5>
                    </div>
                    <div className="p-4">
                        <table className="min-w-full">
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500" style={{ width: "140px" }}>Total Assessments</td>
                                    <td className="py-2 text-sm font-medium">{student.total_assessments ?? "—"}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">Average Score</td>
                                    <td className="py-2 text-sm font-medium">
                                        {student.average_score != null
                                            ? `${student.average_score}%`
                                            : "—"}
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 text-xs text-gray-500">Attendance Rate</td>
                                    <td className="py-2 text-sm font-medium">
                                        {student.attendance_rate != null
                                            ? `${student.attendance_rate}%`
                                            : "—"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-xs text-gray-500">Overall Grade</td>
                                    <td className="py-2 text-sm font-medium">{student.overall_grade || "—"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherStudentDetails;

