import React, { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import api from "../api/api";

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    classroom: "",
    assessment_type: "",
    academic_year: "",
    term: "",
    total_marks: "",
    assessment_date: "",
  });

  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("access_token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchAssessments();
    fetchAssessmentTypes();
    fetchSubjects();
    fetchClassrooms();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await api.get(
        "assessments/",
        config
      );
      setAssessments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAssessmentTypes = async () => {
    try {
      const res = await api.get(
        "results/assessment-types/",
        config
      );
      setAssessmentTypes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get(
        "subjects/",
        config
      );
      setSubjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const res = await api.get(
        "classes/",
        config
      );
      setClassrooms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const clearForm = () => {
    setEditingId(null);

    setFormData({
      title: "",
      subject: "",
      classroom: "",
      assessment_type: "",
      academic_year: "",
      term: "",
      total_marks: "",
      assessment_date: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `assessments/${editingId}/`,
          formData,
          config
        );
      } else {
        await api.post(
          "assessments/",
          formData,
          config
        );
      }

      fetchAssessments();
      clearForm();
    } catch (err) {
      console.log(err.response?.data);
    }
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
      assessment_date: assessment.assessment_date,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assessment?")) return;

    try {
      await api.delete(
        `assessments/${id}/`,
        config
      );

      fetchAssessments();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredAssessments = assessments.filter((assessment) =>
    assessment.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex items-center gap-3 mb-6">
          <FaClipboardList className="text-3xl text-indigo-600" />
          <h1 className="text-2xl font-bold">Assessments</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <input
            type="text"
            name="title"
            placeholder="Assessment Title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          />

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          >
            <option value="">Select Subject</option>

            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          <select
            name="classroom"
            value={formData.classroom}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          >
            <option value="">Select Classroom</option>

            {classrooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.grade} {room.stream}
              </option>
            ))}
          </select>

          <select
            name="assessment_type"
            value={formData.assessment_type}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          >
            <option value="">Assessment Type</option>

            {assessmentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="academic_year"
            placeholder="Academic Year"
            value={formData.academic_year}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          />

          <input
            type="text"
            name="term"
            placeholder="Term"
            value={formData.term}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          />

          <input
            type="number"
            name="total_marks"
            placeholder="Total Marks"
            value={formData.total_marks}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          />

          <input
            type="date"
            name="assessment_date"
            value={formData.assessment_date}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          />

          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 flex justify-center items-center gap-2"
          >
            <FaPlus />

            {editingId ? "Update Assessment" : "Create Assessment"}
          </button>
        </form>

        <div className="relative mb-5">

          <FaSearch className="absolute top-3 left-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search assessment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg pl-10 p-2 w-full"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-indigo-600 text-white">

              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Class</th>
                <th className="p-3">Type</th>
                <th className="p-3">Marks</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredAssessments.map((assessment) => (
                <tr
                  key={assessment.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{assessment.title}</td>
                  <td className="p-3">{assessment.subject_name}</td>
                  <td className="p-3">{assessment.classroom_name}</td>
                  <td className="p-3">{assessment.assessment_type_name}</td>
                  <td className="p-3">{assessment.total_marks}</td>
                  <td className="p-3">{assessment.assessment_date}</td>

                  <td className="p-3 flex gap-3">

                    <button
                      onClick={() => handleEdit(assessment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(assessment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Assessments;