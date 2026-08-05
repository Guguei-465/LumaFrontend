import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

const MarkAttendance = () => {
    const [submission, setSubmission] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const { id } = useParams();

    useEffect(() => {
        fetchAttendance();
    }, [id]);

    const fetchAttendance = async () => {
        try {
            setLoading(true);

            const { data } = await api.get(
                `/attendance/mark/?assignment=${id}`
            );

            setSubmission(data);
            setStudents(data.students);

        } catch (err) {
            console.error(err);
            setError("Failed to load attendance.");
        } finally {
            setLoading(false);
        }
    }; 

    const updateStatus = (studentId, status) => {
        setStudents(prev =>
            prev.map(student =>
                student.student === studentId
                    ? { ...student, status }
                    : student
            )
        );
    };

    const updateRemarks = (studentId, remarks) => {
        setStudents(prev =>
            prev.map(student =>
                student.student === studentId
                    ? { ...student, remarks }
                    : student
            )
        );
    };

    const saveAttendance = async () => {
        try {
            setSaving(true);

            await api.post("/attendance/mark/", {
                submission: submission.submission,
                records: students.map(student => ({
                    student: student.student,
                    status: student.status,
                    remarks: student.remarks,
                })),
            });

            alert("Attendance saved successfully.");

        } catch (err) {
            console.error(err);
            alert("Failed to save attendance.");
        } finally {
            setSaving(false);
        }
    };
 

    const markAll = (status) => {
        setStudents((previous) =>
            previous.map((student) => ({
                ...student,
                status,
            }))
        );
    };

    const submitAttendance = async () => {
        try {
            await api.post("/attendance/submit/", {
                submission: submission.submission,
            });

            alert("Attendance submitted for approval.");

            fetchAttendance();

        } catch (err) {
            console.error(err);
            alert("Failed to submit attendance.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-lg font-semibold">
                    Loading attendance...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-100 border border-red-300 p-4 text-red-700">
                {error}
            </div>
        );
    }
  

    return (
         <div className="space-y-6">

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-lg font-bold mb-4">
                    Mark Attendance
                </h2>

                <div className="grid md:grid-cols-3 gap-4 mb-6">

                    <div>
                        <p className="text-gray-500 text-xs">
                            Class
                        </p>

                        <p className="font-semibold text-sm">
                            {submission.classroom_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-xs">
                            Date
                        </p>

                        <p className="font-semibold text-sm">
                            {submission.date}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-xs">
                            Status
                        </p>

                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                            {submission.approval_status}
                        </span>
                    </div>

                </div>

                <div className="flex flex-wrap gap-2 mb-6">

                    <button
                        onClick={() => markAll("Present")}
                        className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                    >
                        All Present
                    </button>

                    <button
                        onClick={() => markAll("Absent")}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                        All Absent
                    </button>

                    <button
                        onClick={() => markAll("Excused")}
                        className="px-3 py-1.5 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                    >
                        All Excused
                    </button>
                </div>


                                <div className="overflow-x-auto">

                    <table className="min-w-full border border-gray-200">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Adm No
                                </th>

                                <th className="border px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Student
                                </th>

                                <th className="border px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Present
                                </th>

                                <th className="border px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Absent
                                </th>

                                <th className="border px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Excused
                                </th>

                                <th className="border px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Remarks
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {students.map((student) => (

                                <tr
                                    key={student.student}
                                    className="hover:bg-gray-50"
                                >

                                    <td className="border px-3 py-2 text-sm">
                                        {student.admission_number}
                                    </td>

                                    <td className="border px-3 py-2 font-medium text-sm">
                                        {student.student_name}
                                    </td>

                                    <td className="border px-3 py-2 text-center">

                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    student.student,
                                                    "Present"
                                                )
                                            }
                                            className={`w-8 h-8 rounded-full transition text-sm ${
                                                student.status === "Present"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-200 hover:bg-green-100"
                                            }`}
                                        >
                                            ✓
                                        </button>

                                    </td>

                                    <td className="border px-3 py-2 text-center">

                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    student.student,
                                                    "Absent"
                                                )
                                            }
                                            className={`w-8 h-8 rounded-full transition text-sm ${
                                                student.status === "Absent"
                                                    ? "bg-red-600 text-white"
                                                    : "bg-gray-200 hover:bg-red-100"
                                            }`}
                                        >
                                            ✕
                                        </button>

                                    </td>

                                    <td className="border px-3 py-2 text-center">

                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    student.student,
                                                    "Excused"
                                                )
                                            }
                                            className={`w-8 h-8 rounded-full transition text-sm ${
                                                student.status === "Excused"
                                                    ? "bg-yellow-500 text-white"
                                                    : "bg-gray-200 hover:bg-yellow-100"
                                            }`}
                                        >
                                            E
                                        </button>

                                    </td>

                                    <td className="border px-3 py-2">

                                        <input
                                            type="text"
                                            value={student.remarks || ""}
                                            onChange={(e) =>
                                                updateRemarks(
                                                    student.student,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Remarks..."
                                            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                        onClick={saveAttendance}
                        disabled={
                            saving ||
                            submission.approval_status === "Pending" ||
                            submission.approval_status === "Approved"
                        }
                        className={`px-5 py-2 rounded-lg font-medium text-white transition text-sm ${
                            saving
                                ? "bg-gray-400 cursor-not-allowed"
                                : submission.approval_status === "Pending" ||
                                  submission.approval_status === "Approved"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {saving ? "Saving..." : "Save Attendance"}
                    </button>

                    <button
                        onClick={submitAttendance}
                        disabled={
                            saving ||
                            submission.approval_status === "Pending" ||
                            submission.approval_status === "Approved"
                        }
                        className={`px-5 py-2 rounded-lg font-medium text-white transition text-sm ${
                            submission.approval_status === "Pending" ||
                            submission.approval_status === "Approved"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        Submit Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarkAttendance;


 