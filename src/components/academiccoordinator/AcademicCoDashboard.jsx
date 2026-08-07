import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AcademicCoDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    classes: 0,
    assessments: 0,
    pendingResults: 0,
    approvedResults: 0,
    timetables: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  // Helper: get correct count from ANY response (paginated or plain array)
  const getCount = (res) => {
    const data = res.data;
    if (data?.count) return data.count; // prefer DRF total count
    if (Array.isArray(data)) return data.length; // plain array
    if (Array.isArray(data?.results)) return data.results.length; // paginated fallback length
    return 0;
  };

  const loadDashboard = async () => {
    try {
      const [
        students,
        teachers,
        subjects,
        classes,
        assessments,
        pendingResults,
        approvedResults,
        timetable,
      ] = await Promise.all([
        api.get("students/"),
        api.get("teachers/"),
        api.get("subjects/"),
        api.get("classes/"),
        api.get("results/assessments/"),
        api.get("results/pending/"),
        api.get("results/approved/"),
        api.get("timetable/"),
      ]);

      setStats({
        students: getCount(students),
        teachers: getCount(teachers),
        subjects: getCount(subjects),
        classes: getCount(classes),
        assessments: getCount(assessments),
        pendingResults: getCount(pendingResults),
        approvedResults: getCount(approvedResults),
        timetables: getCount(timetable),
      });
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Students", value: stats.students },
    { title: "Assigned Teachers", value: stats.teachers },
    { title: "School Subjects", value: stats.subjects },
    { title: "Active Classes", value: stats.classes },
    { title: "Assessments", value: stats.assessments },
    { title: "Pending Approval", value: stats.pendingResults },
    { title: "Approved Results", value: stats.approvedResults },
    { title: "Timetable Entries", value: stats.timetables },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-gray-500">
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
          Academic Coordinator Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Academic oversight, progress tracking & quality control
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="stat-card py-6">
            <p className="text-gray-700 font-medium">{card.title}</p>
            <p className="stat-value mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="font-semibold text-lg mb-3 text-gray-800">Manage Classes & Subjects</h2>
          <p className="text-gray-500 mb-4">Oversee class organization, subject allocation & teacher assignments.</p>
          <button
            onClick={() => navigate("/academic-coordinator/classes")}
            className="milk-btn w-full"
          >
            View Classes
          </button>
        </div>

        <div className="card">
          <h2 className="font-semibold text-lg mb-3 text-gray-800">Review & Approve Results</h2>
          <p className="text-gray-500 mb-4">Verify submitted marks, approve or flag corrections for student records.</p>
          <button
            onClick={() => navigate("/academic-coordinator/results")}
            className="milk-btn w-full"
          >
            Check Pending Results
          </button>
        </div>

        <div className="card">
          <h2 className="font-semibold text-lg mb-3 text-gray-800">Academic Reports & Timetables</h2>
          <p className="text-gray-500 mb-4">Generate performance reports, monitor exam schedules & timetables.</p>
          <button
            onClick={() => navigate("/academic-coordinator/reports")}
            className="milk-btn w-full"
          >
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademicCoDashboard;