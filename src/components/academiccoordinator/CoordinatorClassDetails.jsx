import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

const CoordinatorClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClassDetails = async () => {
      try {
        const [classRes, studentsRes, subjectsRes] = await Promise.all([
          api.get(`classes/${id}/`),
          api.get(`classes/${id}/students/`),
          api.get(`classes/${id}/subjects/`),
        ]);
        setClassData(classRes.data);
        setStudents(studentsRes.data.results || studentsRes.data);
        setSubjects(subjectsRes.data.results || subjectsRes.data);
      } catch (err) {
        console.error("Failed to load class details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadClassDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">Loading class details...</p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="card text-center py-10">
        <p className="text-red-500 text-lg">Class not found.</p>
        <button onClick={() => navigate(-1)} className="milk-btn mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + Back Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
            {classData.name} {classData.stream && `- ${classData.stream}`}
          </h1>
          <p className="text-gray-500 mt-2">Class overview, students & subjects</p>
        </div>
        <button onClick={() => navigate(-1)} className="milk-btn w-fit">
          ← Back to Classes
        </button>
      </div>

      {/* Class Overview Stats — stat-card style */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Class Teacher</p>
          <p className="stat-value text-lg mt-1">{classData.class_teacher || "Not Assigned"}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Total Students</p>
          <p className="stat-value mt-1">{students.length}</p>
        </div>
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">Subjects Offered</p>
          <p className="stat-value mt-1">{subjects.length}</p>
        </div>
      </div>

      {/* Students List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enrolled Students</h2>
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No students enrolled in this class yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-2 text-gray-600">#</th>
                  <th className="py-3 px-2 text-gray-600">Full Name</th>
                  <th className="py-3 px-2 text-gray-600">Admission No.</th>
                  <th className="py-3 px-2 text-gray-600">Gender</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-green-50">
                    <td className="py-3 px-2">{idx + 1}</td>
                    <td className="py-3 px-2">{student.first_name} {student.last_name}</td>
                    <td className="py-3 px-2">{student.admission_number || "—"}</td>
                    <td className="py-3 px-2">{student.gender || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subjects List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Subjects & Assigned Teachers</h2>
        {subjects.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No subjects assigned to this class yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subj) => (
              <div key={subj.id} className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="font-semibold text-gray-800">{subj.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Teacher: {subj.teacher_name || "Not assigned"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorClassDetails;