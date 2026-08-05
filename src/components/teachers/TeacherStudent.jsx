import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

 

const TeacherStudent = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const filtered = students.filter((student) =>
            `${student.student_name} ${student.admission_number} ${student.classroom}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        setFilteredStudents(filtered);
    }, [search, students]);

    const fetchStudents = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/dashboard/teacher/students/");

            setStudents(response.data);
            setFilteredStudents(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load students.");
        } finally {
            setLoading(false);
        }
    };

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
                    <h5 className="mt-3 font-bold text-sm">Unable to Load Students</h5>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <button
                        className="mt-3 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition"
                        onClick={fetchStudents}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                <div>
                    <h3 className="font-bold text-lg mb-1">My Students</h3>
                    <p className="text-gray-500 text-sm">
                        Total Students:{" "}
                        <strong>{filteredStudents.length}</strong>
                    </p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search student..."
                        style={{ minWidth: "250px" }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        className="border border-blue-600 text-blue-600 rounded-lg px-3 py-2 text-sm hover:bg-blue-50 transition"
                        onClick={fetchStudents}
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Photo</th>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admission</th>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="border-b px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        {student.photo ? (
                                            <img
                                                src={student.photo}
                                                alt={student.student_name}
                                                width="40"
                                                height="40"
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="bg-gray-400 rounded-full flex justify-center items-center text-white font-bold"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                }}
                                            >
                                                {student.student_name?.charAt(0)}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-sm text-gray-600">{student.admission_number}</td>

                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {student.student_name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{student.classroom}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{student.gender}</td>
                                    <td className="px-4 py-3">
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

                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/teacher/students/${student.id}`}
                                            className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-blue-700 transition"
                                        >
                                            View
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
                                    <i className="bi bi-people text-gray-400 text-3xl"></i>
                                    <h5 className="mt-3 font-bold text-sm">
                                        No Students Found
                                    </h5>
                                    <p className="text-gray-500 text-sm">
                                        There are no students assigned to
                                        you.
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

export default TeacherStudent;