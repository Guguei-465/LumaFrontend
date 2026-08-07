import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const TimetableForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    academic_year: "",
    term: "",
    day: "",
    start_time: "",
    end_time: "",
    assignment: ""
  });

  const [assignments, setAssignments] = useState([]);
  const [terms, setTerms] = useState([]);      
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = [
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Load Assignments
        const assignRes = await api.get("assignments/");
        setAssignments(assignRes.data.results || assignRes.data);

        // Load unique terms from backend timetable data
        const timeTableRes = await api.get("timetable/");
        // Extract unique, trimmed, non-empty terms + format like days array
        const uniqueTerms = [
          ...new Set(
            timeTableRes.data
              .map(item => item.term?.trim())
              .filter(term => term)
          )
        ].sort(); // optional: alphabetical sort for cleaner list
        setTerms(uniqueTerms);

        // 2. If EDIT: load existing data
        if (id) {
          const res = await api.get(`timetable/${id}/`);
          setFormData({
            academic_year: res.data.academic_year || "",
            term: res.data.term?.trim() || "",
            day: res.data.day || "",
            start_time: res.data.start_time || "",
            end_time: res.data.end_time || "",
            assignment: res.data.assignment || ""
          });
        }

      } catch (err) {
        console.error("Failed to load form data:", err);
        setError("Could not load required data.");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateTimes = () => {
    return formData.start_time && formData.end_time && formData.start_time < formData.end_time;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateTimes()) {
      setError("Start time must be earlier than end time!");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        academic_year: formData.academic_year.trim(),
        term: formData.term,
        day: formData.day,
        start_time: formData.start_time.length === 5 ? formData.start_time + ":00" : formData.start_time,
        end_time: formData.end_time.length === 5 ? formData.end_time + ":00" : formData.end_time,
        assignment: formData.assignment,
        is_active: true
      };

      if (id) {
        await api.put(`timetable/update/${id}/`, payload);
      } else {
        await api.post("timetable/create/", payload);
      }
      navigate("/academic-coordinator/timetable");
    } catch (err) {
      console.error("Save failed:", err);
      console.error("Backend errors:", err.response?.data);
      setError(
        err.response?.data
          ? `Error: ${JSON.stringify(err.response.data)}`
          : "Failed to save — check fields or overlapping time!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
            {id ? "Edit Timetable Entry" : "Create Timetable Entry"}
          </h1>
          <p className="text-gray-500">
            {id ? "Update schedule details" : "Add new lesson/period to timetable"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Academic Year */}
            <div>
              <label className="form-lable">Academic Year <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="academic_year"
                placeholder="e.g 2025-2026"
                value={formData.academic_year}
                onChange={handleChange}
                className="milk-input"
                required
              />
            </div>

            {/* ✅ TERM SELECT — MATCHES DAYS EXACT STYLE/STRUCTURE */}
            <div>
              <label className="form-lable">Term <span className="text-red-500">*</span></label>
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="milk-input"
                required
              >
                <option value="">-- Select Term --</option>
                {terms.length > 0 ? (
                  terms.map((termVal, idx) => (
                    <option key={idx} value={termVal}>
                      {termVal}
                    </option>
                  ))
                ) : (
                  <option disabled>-- No terms found --</option>
                )}
              </select>
            </div>

            {/* Day */}
            <div>
              <label className="form-lable">Day of Week <span className="text-red-500">*</span></label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="milk-input"
                required
              >
                <option value="">-- Select Day --</option>
                {days.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Assignment (Class + Subject + Teacher) */}
            <div className="md:col-span-2">
              <label className="form-lable">Assignment <span className="text-red-500">*</span></label>
              <select
                name="assignment"
                value={formData.assignment}
                onChange={handleChange}
                className="milk-input"
                required
                disabled={assignments.length === 0}
              >
                <option value="">
                  {assignments.length === 0 ? "No assignments available" : "-- Select Assignment --"}
                </option>
                {assignments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.classroom_name || `${a.classroom?.grade} ${a.classroom?.stream}`} — {a.subject_name || a.subject?.name} — {a.teacher_name || `${a.teacher?.user?.first_name} ${a.teacher?.user?.last_name}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="form-lable">Start Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="milk-input"
                required
              />
            </div>

            {/* End Time */}
            <div>
              <label className="form-lable">End Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="milk-input"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className="milk-btn min-w-[150px]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <i className="bi bi-arrow-repeat animate-spin"></i> Saving...
                </span>
              ) : (
                id ? "Update Entry" : "Save Entry"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableForm;