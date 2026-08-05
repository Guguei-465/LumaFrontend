import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const StudentsAcademic = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchStudents(); }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get("students/");
            if (Array.isArray(response.data)) {
                setStudents(response.data);
            } else {
                setStudents(response.data.results || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter((student) => {
        const fullname = `${student.first_name} ${student.last_name}`.toLowerCase();
        return (
            fullname.includes(search.toLowerCase()) ||
            student.admission_number?.toLowerCase().includes(search.toLowerCase()) ||
            student.classroom_name?.toLowerCase().includes(search.toLowerCase())
        );
    });

    const deleteStudent = async (id) => {
        if (!window.confirm("Delete this student?")) return;
        try {
            await api.delete(`/students/delete/${id}/`);
            setStudents(students.filter((s) => s.id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Students</h1>
                    <p className="text-gray-500">Manage all registered students.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
                <div className="relative">
                    <i className="bi bi-search absolute left-4 top-3 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Search student..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading students...</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">Photo</th>
                                <th className="px-4 py-3 text-left">Admission No</th>
                                <th className="px-4 py-3 text-left">Student</th>
                                <th className="px-4 py-3 text-left">Gender</th>
                                <th className="px-4 py-3 text-left">Classroom</th>
                                <th className="px-4 py-3 text-left">Parent</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-12 text-gray-500">No students found.</td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            {student.photo ? (
                                                <img src={student.photo} alt="" className="w-12 h-12 rounded-full object-cover" />
                                            ) : (
                                                <i className="bi bi-person-circle text-4xl text-gray-400"></i>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">{student.admission_number}</td>
                                        <td className="px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                                        <td className="px-4 py-3">{student.gender}</td>
                                        <td className="px-4 py-3">{student.classroom_name}</td>
                                        <td className="px-4 py-3">{student.parent_name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${student.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-3">
                                                <Link to={`/academic-coordinator/students/${student.id}`} className="text-blue-600 hover:text-blue-800">
                                                    <i className="bi bi-eye-fill"></i>
                                                </Link>
                                                <Link to={`/academic-coordinator/students/update/${student.id}`} className="text-green-600 hover:text-green-800">
                                                    <i className="bi bi-pencil-square"></i>
                                                </Link>
                                                <button onClick={() => deleteStudent(student.id)} className="text-red-600 hover:text-red-800">
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StudentsAcademic;
