import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const TimetableForm = () => {
  const { id } = useParams(); // /create = no id = ADD; /:id = EDIT
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    academic_year: "",
    term: "",
    day: "",
    start_time: "",
    end_time: "",
    class_assigned: "",
    subject: "",
    teacher: ""
  });

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
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

  // Load supporting data + existing entry if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjRes, teachRes] = await Promise.all([
          api.get("classes/"),
          api.get("subjects/"),
          api.get("users/teachers/") // adjust endpoint to match yours
        ]);
        setClasses(classesRes.data.results || classesRes.data);
        setSubjects(subjRes.data.results || subjRes.data);
        setTeachers(teachRes.data.results || teachRes.data);

        // If editing, load existing timetable entry
        if (id) {
          const res = await api.get(`timetable/${id}/`);
          setFormData({
            academic_year: res.data.academic_year,
            term: res.data.term,
            day: res.data.day,
            start_time: res.data.start_time,
            end_time: res.data.end_time,
            class_assigned: res.data.class_assigned,
            subject: res.data.subject,
            teacher: res.data.teacher
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
    return formData.start_time < formData.end_time;
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
      if (id) {
        // UPDATE existing
        await api.put(`timetable/${id}/`, formData);
      } else {
        // CREATE new
        await api.post("timetable/", formData);
      }
      navigate("/academic-coordinator/timetable"); // go back to list
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.response?.data?.detail || "Failed to save timetable entry. Check for time clashes!");
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

            {/* Term */}
            <div>
              <label className="form-lable">Term <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="term"
                placeholder="e.g Term 1"
                value={formData.term}
                onChange={handleChange}
                className="milk-input"
                required
              />
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

            {/* Class */}
            <div>
              <label className="form-lable">Class / Grade <span className="text-red-500">*</span></label>
              <select
                name="class_assigned"
                value={formData.class_assigned}
                onChange={handleChange}
                className="milk-input"
                required
              >
                <option value="">-- Select Class --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.stream || ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="form-lable">Subject <span className="text-red-500">*</span></label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="milk-input"
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Teacher */}
            <div>
              <label className="form-lable">Assigned Teacher <span className="text-red-500">*</span></label>
              <select
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                className="milk-input"
                required
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.first_name} {t.last_name}
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