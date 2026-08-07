import React, { useEffect, useState } from "react";
import api from "../api/api";

const Timetable = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ year: "", term: "", class_id: "" });

  const daysOrder = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayNames = {
    MON: "Monday", TUE: "Tuesday", WED: "Wednesday",
    THU: "Thursday", FRI: "Friday", SAT: "Saturday"
  };

  useEffect(() => {
    loadTimetable();
  }, [filters]);

  const loadTimetable = async () => {
    try {
      let res;
      const params = {};
      if (filters.year) params.academic_year = filters.year;
      if (filters.term) params.term = filters.term;

      if (filters.class_id) {
        res = await api.get(`timetable/classroom/${filters.class_id}/`, { params });
      } else {
        res = await api.get("timetable/", { params });
      }

      const data = res.data;
      setTimetableData(data);

      // Group by day for display
      const grouped = {};
      daysOrder.forEach(day => grouped[day] = { name: dayNames[day], entries: [] });
      data.forEach(entry => {
        if (grouped[entry.day]) {
          grouped[entry.day].entries.push(entry);
        }
      });
      setGroupedByDay(grouped);

    } catch (err) {
      console.error("Failed to load timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-10"><p>Loading Timetable...</p></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">Class Timetable</h1>
          <p className="text-gray-500">Weekly class schedule & lesson times</p>
        </div>
        <button onClick={() => window.location.href="/academic-coordinator/timetable/create"} className="milk-btn w-fit">
          + Create Timetable
        </button>
      </div>

      {/* Filters — now send to backend! */}
      <div className="card grid md:grid-cols-3 gap-4">
        <div>
          <label className="form-lable">Academic Year</label>
          <input 
            type="text" 
            placeholder="2025-2026" 
            className="milk-input" 
            value={filters.year} 
            onChange={(e) => setFilters({...filters, year: e.target.value})}
          />
        </div>
        <div>
          <label className="form-lable">Term</label>
          <input 
            type="text" 
            placeholder="Term 1" 
            className="milk-input" 
            value={filters.term} 
            onChange={(e) => setFilters({...filters, term: e.target.value})}
          />
        </div>
        <div>
          <label className="form-lable">Filter by Class ID</label>
          <input 
            type="number" 
            placeholder="Class ID" 
            className="milk-input" 
            value={filters.class_id} 
            onChange={(e) => setFilters({...filters, class_id: e.target.value})}
          />
        </div>
      </div>

      {/* Weekly Timetable Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(groupedByDay).map(day => (
          <div key={day.name} className="card">
            <h3 className="text-lg font-bold text-green-700 mb-4 border-b pb-2">{day.name}</h3>
            {day.entries.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No lessons scheduled</p>
            ) : (
              <div className="space-y-3">
                {day.entries.map(entry => (
                  <div key={entry.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-semibold">{entry.subject_name}</p>
                    <p className="text-sm text-gray-600">
                      {entry.teacher_name} • {entry.start_time} - {entry.end_time}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;