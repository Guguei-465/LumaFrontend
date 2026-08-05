import React, { useEffect, useState } from "react";
import api from "../api/api";


const AcademicCoDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    timetables: 0,
    assessments: 0,
    results: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        students,
        teachers,
        subjects,
        timetable,
        assessments,
        results,
      ] = await Promise.all([
        api.get("students/"),
        api.get("teachers/"),
        api.get("subjects/"),
        api.get("timetable/"),
        api.get("results/assessments/"),
        api.get("results/results/"),
      ]);

      setStats({
        students: students.data.count || students.data.length,
        teachers: teachers.data.count || teachers.data.length,
        subjects: subjects.data.count || subjects.data.length,
        timetables: timetable.data.count || timetable.data.length,
        assessments: assessments.data.count || assessments.data.length,
        results: results.data.count || results.data.length,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const cards = [
    { title: "Students", value: stats.students, icon: <i className="bi bi-people-fill text-2xl"></i>, color: "bg-blue-500" },
    { title: "Teachers", value: stats.teachers, icon: <i className="bi bi-person-badge-fill text-2xl"></i>, color: "bg-green-500" },
    { title: "Subjects", value: stats.subjects, icon: <i className="bi bi-book-fill text-2xl"></i>, color: "bg-yellow-500" },
    { title: "Timetable", value: stats.timetables, icon: <i className="bi bi-calendar-week-fill text-2xl"></i>, color: "bg-purple-500" },
    { title: "Assessments", value: stats.assessments, icon: <i className="bi bi-clipboard-data-fill text-2xl"></i>, color: "bg-pink-500" },
    { title: "Results", value: stats.results, icon: <i className="bi bi-journal-check text-2xl"></i>, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Academic Coordinator Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back. Here's the current academic overview.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`${card.color} text-white p-3 rounded-xl`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-3">
            Assessments
          </h2>

          <p className="text-gray-500 mb-4">
            Create, edit and manage assessments.
          </p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Manage Assessments
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-3">
            Results
          </h2>

          <p className="text-gray-500 mb-4">
            Review and approve submitted results.
          </p>

          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            View Results
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-3">
            Timetable
          </h2>

          <p className="text-gray-500 mb-4">
            Manage class timetable and teacher schedules.
          </p>

          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            Open Timetable
          </button>
        </div>

      </div>

      {/* Activity */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Academic Summary
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">
              School Overview
            </h3>

            <ul className="space-y-2 text-gray-600">
              <li>Total Students: {stats.students}</li>
              <li>Total Teachers: {stats.teachers}</li>
              <li>Total Subjects: {stats.subjects}</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">
              Academic Activities
            </h3>

            <ul className="space-y-2 text-gray-600">
              <li>Assessments: {stats.assessments}</li>
              <li>Timetable Entries: {stats.timetables}</li>
              <li>Results Recorded: {stats.results}</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AcademicCoDashboard;