import { useEffect, useState } from "react";
import api from "../api/api";

const TeacherProfile = () => {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/assignments/teacher-profile/");
                setTeacher(response.data[0] || null);
        } catch (err) {
            console.error(err);
            setError("Failed to load teacher profile.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 inline-block"></div>
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

    if (!teacher) {
        return (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg p-4">
                No teacher profile found.
            </div>
        );
    }

    return (
        <div className="px-4">
            <div className="bg-white rounded-xl shadow">
                <div className="bg-blue-600 text-white rounded-t-xl px-6 py-4">
                    <h4 className="font-bold">My Profile</h4>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        <div className="md:col-span-3 text-center">
                            {teacher.profile_picture ? (
                                <img
                                    src={teacher.profile_picture}
                                    alt="Teacher"
                                    className="rounded-full border-2 mx-auto"
                                    style={{
                                        width: "160px",
                                        height: "160px",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <div
                                    className="rounded-full flex items-center justify-center mx-auto"
                                    style={{
                                        width: "160px",
                                        height: "160px",
                                        backgroundColor: "#0d6efd",
                                        color: "#fff",
                                        fontSize: "48px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {teacher.first_name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-9">

                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">

                                    <tbody className="divide-y divide-gray-200">

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50 w-1/3">Employee Number</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.employee_number}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">First Name</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.first_name}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Last Name</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.last_name}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Gender</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.gender}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Date of Birth</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.date_of_birth}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">National ID</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.national_id}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">TSC Number</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.tsc_number}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Phone Number</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.phone_number}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Email</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.user?.email}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Qualification</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.qualification}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Specialization</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.specialization}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Employment Date</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.employment_date}</td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Status</th>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {teacher.employment_status}
                                                </span>
                                            </td>
                                        </tr>

                                        <tr className="hover:bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">Address</th>
                                            <td className="px-4 py-3 text-sm text-gray-900">{teacher.address}</td>
                                        </tr>

                                    </tbody>

                                </table>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;