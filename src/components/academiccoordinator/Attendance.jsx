import React, { useEffect, useState } from "react";
import api from "../api/api";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ classroom: "", date: "", status: "" });

  useEffect(() => {
    loadRecords();
  }, [filters]);

  const loadRecords = async () => {
    try {
      const params = {};
      if (filters.classroom) params.classroom = filters.classroom;
      if (filters.date) params.date = filters.date;
      if (filters.status) params.status = filters.status;

      const res = await api.get("attendance/", { params });
      setAttendance(res.data);
    } catch (err) {
      console.error("Failed to load attendance:", err);
      alert("Could not load attendance records");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><p>Loading all attendance records...</p></div>;

  return (
    <div className="space-y-8 p-2">
      {/* Page Header — Coordinator Focus: Review & Report */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">Attendance Overview (All Classes)</h1>
          <p className="text-gray-500">Review, filter & generate reports across entire school</p>
        </div>
        {/* Backup Mark Button — secondary action */}
        <button 
          onClick={() => window.location.href="/academic-coordinator/attendance/mark"} 
          className="px-4 py-2 border border-blue-600 text-blue-700 rounded-lg hover:bg-blue-50 transition"
        >
          + Mark Attendance (Backup)
        </button>
      </div>

      {/* Filter Bar — filter ANY class/date/status */}
      <div className="card grid md:grid-cols-3 gap-4">
        <div>
          <label className="form-label">Filter by Class ID</label>
          <input
            type="number"
            className="milk-input"
            placeholder="e.g 3"
            value={filters.classroom}
            onChange={(e) => setFilters({...filters, classroom: e.target.value})}
          />
        </div>
        <div>
          <label className="form-label">Filter by Date</label>
          <input
            type="date"
            className="milk-input"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
          />
        </div>
        <div>
          <label className="form-label">Filter by Status</label>
          <select
            className="milk-input"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="P">Present</option>
            <option value="A">Absent</option>
            <option value="L">Late</option>
            <option value="E">Excused</option>
          </select>
        </div>
      </div>

      {/* Full Attendance Table — All Records Visible */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2">
              <th className="text-left p-3">Admission No</th>
              <th className="text-left p-3">Student Name</th>
              <th className="text-left p-3">Class</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">No attendance records found</td></tr>
            ) : (
              attendance.map(record => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{record.student_adm_no}</td>
                  <td className="p-3">{record.student_name}</td>
                  <td className="p-3">{record.class_name}</td>
                  <td className="p-3">{record.date}</td>
                  <td className="p-3 font-medium">
                    <span className={`px-3 py-1 rounded text-white text-sm ${
                      record.status === "P" ? "bg-green-600" :
                      record.status === "A" ? "bg-red-600" :
                      record.status === "L" ? "bg-yellow-500" : "bg-blue-500"
                    }`}>
                      {record.status_display}
                    </span>
                  </td>
                  <td className="p-3">{record.remarks || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;