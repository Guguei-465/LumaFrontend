import React, { useEffect, useState } from "react";
import { FaClipboardList, FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import api from "../api/api";

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "", subject: "", classroom: "", assessment_type: "",
    academic_year: "", term: "", total_marks: "", assessment_date: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAssessments();
    fetchAssessmentTypes();
    fetchSubjects();
    fetchClassrooms();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await api.get("assessments/");
      setAssessments(res.data.results || res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAssessmentTypes = async () => {
    try {
      const res = await api.get("results/assessment-types/");
      setAssessmentTypes(res.data.results || res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("subjects/");
      setSubjects(res.data.results || res.data);
    } catch (err) { console.error(err); }
  };

  const fetchClassrooms = async () => {
    try {
      const res = await api.get("classes/");
      setClassrooms(res.data.results || res.data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const clearForm = () => {
    setEditingId(null);
    setFormData({ title: "", subject: "", classroom: "", assessment_type: "", academic_year: "", term: "", total_marks: "", assessment_date: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`assessments/${editingId}/`, formData);
      else await api.post("assessments/", formData);
      fetchAssessments();
      clearForm();
    } catch (err) { console.error(err.response?.data); }
  };

  const handleEdit = (assessment) => {
    setEditingId(assessment.id);
    setFormData({
      title: assessment.title,
      subject: assessment.subject,
      classroom: assessment.classroom,
      assessment_type: assessment.assessment_type,
      academic_year: assessment.academic_year,
      term: assessment.term,
      total_marks: assessment.total_marks,
      assessment_date: assessment.assessment_date
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assessment?")) return;
    try {
      await api.delete(`assessments/${id}/`);
      fetchAssessments();
    } catch (err) { console.error(err); }
  };

  const filteredAssessments = assessments.filter(a => a.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <FaClipboardList className="text-3xl text-green-600" />
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">Assessments</h1>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" name="title" placeholder="Assessment Title" value={formData.title} onChange={handleChange} className="milk-input" required />
          <select name="subject" value={formData.subject} onChange={handleChange} className="milk-input" required>
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select name="classroom" value={formData.classroom} onChange={handleChange} className="milk-input" required>
            <option value="">Select Class</option>
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.name} {c.stream || ""}</option>)}
          </select>
          <select name="assessment_type" value={formData.assessment_type} onChange={handleChange} className="milk-input" required>
            <option value="">Assessment Type</option>
            {assessmentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="text" name="academic_year" placeholder="Academic Year" value={formData.academic_year} onChange={handleChange} className="milk-input" required />
          <input type="text" name="term" placeholder="Term" value={formData.term} onChange={handleChange} className="milk-input" required />
          <input type="number" name="total_marks" placeholder="Total Marks" value={formData.total_marks} onChange={handleChange} className="milk-input" required />
          <input type="date" name="assessment_date" value={formData.assessment_date} onChange={handleChange} className="milk-input" required />
          <button type="submit" className="milk-btn flex items-center justify-center gap-2 lg:col-span-4">
            <FaPlus /> {editingId ? "Update Assessment" : "Create Assessment"}
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search assessments..." value={search} onChange={(e) => setSearch(e.target.value)} className="milk-input pl-10" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-3">Title</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Class</th>
              <th className="p-3">Type</th>
              <th className="p-3">Total Marks</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssessments.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">No assessments found.</td></tr>
            ) : filteredAssessments.map(a => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-green-50">
                <td className="p-3">{a.title}</td>
                <td className="p-3">{a.subject_name || a.subject}</td>
                <td className="p-3">{a.classroom_name || a.classroom}</td>
                <td className="p-3">{a.assessment_type_name || a.assessment_type}</td>
                <td className="p-3">{a.total_marks}</td>
                <td className="p-3">{a.assessment_date}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => handleEdit(a)} className="text-green-600 hover:text-green-800"><FaEdit /></button>
                    <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assessments;