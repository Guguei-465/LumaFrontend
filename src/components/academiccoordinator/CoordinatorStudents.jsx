import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CoordinatorStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studRes, classRes] = await Promise.all([
        api.get("students/"),
        api.get("classes/")
      ]);
      setStudents(studRes.data.results || studRes.data);
      setClasses(classRes.data.results || classRes.data);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter by name/admission/class
  const filteredStudents = students.filter((stu) => {
    const matchSearch =
      stu.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu.admission_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === "all" || String(stu.current_class?.id) === selectedClass;
    return matchSearch && matchClass;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
          Student Directory
        </h1>
        <p className="text-gray-500 mt-2">
          View, search and manage all registered students
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or admission number..."
          className="milk-input flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="milk-input max-w-xs"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="all">All Classes</option>
          {classes.map((cls) => (
            <option key={cls.id} value={String(cls.id)}>
              {cls.name} {cls.stream && `- ${cls.stream}`}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Total Students</p>
          <p className="stat-value">{students.length}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Male Students</p>
          <p className="stat-value">{students.filter(s => s.gender === "Male").length}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Female Students</p>
          <p className="stat-value">{students.filter(s => s.gender === "Female").length}</p>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        {filteredStudents.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No students found matching your search/filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-3 text-gray-600">#</th>
                  <th className="py-3 px-3 text-gray-600">Full Name</th>
                  <th className="py-3 px-3 text-gray-600">Admission No.</th>
                  <th className="py-3 px-3 text-gray-600">Current Class</th>
                  <th className="py-3 px-3 text-gray-600">Gender</th>
                  <th className="py-3 px-3 text-gray-600 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((stu, idx) => (
                  <tr key={stu.id} className="border-b border-gray-100 hover:bg-green-50">
                    <td className="py-3 px-3">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium">
                      {stu.first_name} {stu.last_name}
                    </td>
                    <td className="py-3 px-3">{stu.admission_number || "—"}</td>
                    <td className="py-3 px-3">
                      {stu.current_class?.name || "Unassigned"}
                      {stu.current_class?.stream && ` - ${stu.current_class.stream}`}
                    </td>
                    <td className="py-3 px-3">{stu.gender || "—"}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => navigate(`/academic-coordinator/students/${stu.id}`)}
                        className="milk-btn px-4 py-2 text-sm"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorStudents;