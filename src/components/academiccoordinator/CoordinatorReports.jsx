import React, { useState } from "react";

const CoordinatorReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Report definitions — title, description, endpoint/type
  const reportsList = [
    {
      id: "class-performance",
      title: "Class Performance Summary",
      desc: "Academic averages, grade distribution & subject performance per class",
      icon: "bi-building",
    },
    {
      id: "exam-results",
      title: "Exam Results Report",
      desc: "Full result list, statistics & pass rates for selected term/exam",
      icon: "bi-journal-bookmark-fill",
    },
    {
      id: "student-progress",
      title: "Student Progress Report",
      desc: "Individual student term performance, strengths & areas for improvement",
      icon: "bi-person-lines-fill",
    },
    {
      id: "attendance-summary",
      title: "Attendance Summary Report",
      desc: "Class/student attendance rates, present/absent breakdown",
      icon: "bi-calendar-check-fill",
    },
    {
      id: "teacher-performance",
      title: "Teacher Subject Performance",
      desc: "Overview of subject results per assigned teacher",
      icon: "bi-person-badge-fill",
    },
    {
      id: "term-overview",
      title: "Full Term Academic Overview",
      desc: "Consolidated summary of all academic metrics for the term",
      icon: "bi-graph-up-arrow",
    },
  ];

  const handleGenerate = (reportId) => {
    setSelectedReport(reportId);
    setGenerating(true);
    // Simulate API call/generation delay — replace with actual API request
    setTimeout(() => {
      alert(`${reportsList.find(r => r.id === reportId)?.title} generated successfully! Ready for download.`);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
          Academic Reports
        </h1>
        <p className="text-gray-500 mt-2">
          Generate, preview and download structured academic reports & summaries
        </p>
      </div>

      {/* Reports Grid — card style */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportsList.map((report) => (
          <div key={report.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xl">
                <i className={`bi ${report.icon}`}></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{report.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{report.desc}</p>
              </div>
            </div>
            <button
              onClick={() => handleGenerate(report.id)}
              disabled={generating}
              className="milk-btn w-full"
            >
              {generating && selectedReport === report.id ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="bi bi-arrow-repeat animate-spin"></i> Generating...
                </span>
              ) : (
                "Generate & Download"
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Quick Tips Section */}
      <div className="stat-card py-6">
        <h3 className="font-semibold text-green-800 mb-2">💡 Report Tips</h3>
        <ul className="text-gray-700 space-y-1 list-disc pl-5">
          <li>Reports download as PDF for printing or official records.</li>
          <li>Generate <strong>Exam Results</strong> after approval for accurate statistics.</li>
          <li>Use <strong>Class Performance</strong> to identify subjects needing extra support.</li>
          <li>Share <strong>Student Progress</strong> reports with parents during meetings.</li>
        </ul>
      </div>
    </div>
  );
};

export default CoordinatorReports;