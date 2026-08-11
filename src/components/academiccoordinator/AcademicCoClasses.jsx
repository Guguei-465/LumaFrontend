import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AcademicCoClasses = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    grade: "",
    stream: "",
    capacity: "",
    class_teacher: "",
  });

  const [formError, setFormError] = useState("");

  // =====================================================
  // LOAD CLASSES
  // =====================================================
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);

      const [classesRes, studentsRes] = await Promise.all([
        api.get("classes/?ordering=-created_at"),
        api.get("reports/students/by-class/"),
      ]);

      const classData = classesRes.data.results || classesRes.data || [];
      const studentReports =
        studentsRes.data.results || studentsRes.data || [];

      // Add current student count to each class
      const updatedClasses = classData.map((cls) => {
        const classroomName = `${cls.grade}${
          cls.stream ? ` ${cls.stream}` : ""
        }`;

        const report = studentReports.find(
          (item) =>
            item.classroom?.toLowerCase() ===
            classroomName.toLowerCase()
        );

        return {
          ...cls,
          total_students: report?.total_students || 0,
        };
      });

      setClasses(updatedClasses);
    } catch (err) {
      console.error("Failed to load classes:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD TEACHERS
  // =====================================================
  const loadTeachers = async () => {
    try {
      const res = await api.get("teachers/");
      setTeachers(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load teachers:", err);
    }
  };

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================
  const openCreateModal = async () => {
    setFormError("");

    setFormData({
      grade: "",
      stream: "",
      capacity: "",
      class_teacher: "",
    });

    await loadTeachers();

    setShowCreateModal(true);
  };

  // =====================================================
  // CLOSE CREATE MODAL
  // =====================================================
  const closeCreateModal = () => {
    if (saving) return;

    setShowCreateModal(false);
    setFormError("");

    setFormData({
      grade: "",
      stream: "",
      capacity: "",
      class_teacher: "",
    });
  };

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE CLASS
  // =====================================================
  const handleCreateClass = async (e) => {
    e.preventDefault();

    setFormError("");

    // Basic validation
    if (!formData.grade.trim()) {
      setFormError("Please select or enter a grade.");
      return;
    }

    if (!formData.stream.trim()) {
      setFormError("Please enter a stream.");
      return;
    }

    if (!formData.capacity || Number(formData.capacity) <= 0) {
      setFormError("Please enter a valid class capacity.");
      return;
    }

    if (!formData.class_teacher) {
      setFormError("Please select a class teacher.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        grade: formData.grade,
        stream: formData.stream,
        capacity: Number(formData.capacity),
        class_teacher: Number(formData.class_teacher),
      };

      await api.post("classes/create/", payload);

      // Close modal
      closeCreateModal();

      // Refresh classes
      await loadClasses();
    } catch (err) {
      console.error("Failed to create class:", err);

      const backendError = err.response?.data;

      if (backendError) {
        if (typeof backendError === "string") {
          setFormError(backendError);
        } else if (backendError.detail) {
          setFormError(backendError.detail);
        } else {
          setFormError(
            Object.values(backendError).flat().join(" ")
          );
        }
      } else {
        setFormError("Failed to create class. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // FILTER CLASSES
  // =====================================================
  const filteredClasses = classes.filter((cls) => {
    const grade = cls.grade?.toLowerCase() || "";
    const stream = cls.stream?.toLowerCase() || "";
    const teacher = cls.class_teacher_name?.toLowerCase() || "";

    const search = searchTerm.toLowerCase();

    return (
      grade.includes(search) ||
      stream.includes(search) ||
      teacher.includes(search)
    );
  });

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">
          Loading classes...
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================
  return (
    <div className="space-y-8">

      {/* =================================================
          PAGE HEADER
      ================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
            Manage Classes
          </h1>

          <p className="text-gray-500 mt-2">
            View, monitor and manage all school classes
          </p>
        </div>

         {/* BACK TO DASHBOARD */}
        <button
          onClick={() => navigate("/academic-coordinator")}
          className="milk-btn w-fit flex items-center gap-2"
        >
          <i className="bi bi-arrow-left"></i>
          Back to Dashboard
        </button>

        {/* CREATE CLASS BUTTON */}
        <button
          onClick={openCreateModal}
          className="milk-btn w-fit"
        >
          + Create Class
        </button>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}
      <div className="card">

        <input
          type="text"
          placeholder="Search by grade, stream or teacher..."
          className="milk-input max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>

      {/* =================================================
          CLASSES LIST
      ================================================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {filteredClasses.length === 0 ? (

          <div className="card col-span-full text-center text-gray-500 py-10">
            No classes found.
          </div>

        ) : (

          filteredClasses.map((cls) => (

            <div
              key={cls.id}
              className="card hover:shadow-lg transition-shadow"
            >

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {cls.grade}

                {cls.stream && ` - ${cls.stream}`}
              </h3>

              <div className="space-y-2 mb-5 text-gray-600">

                <p>
                  <span className="font-medium">
                    Class Teacher:
                  </span>{" "}
                  {cls.class_teacher_name || "Not assigned"}
                </p>

                <p>
                  <span className="font-medium">
                    Total Students:
                  </span>{" "}
                  {cls.total_students}
                </p>

                <p>
                  <span className="font-medium">
                    Capacity:
                  </span>{" "}
                  {cls.capacity || 0}
                </p>

                <p>
                  <span className="font-medium">
                    Available Spaces:
                  </span>{" "}
                  {Math.max(
                    (cls.capacity || 0) -
                      (cls.total_students || 0),
                    0
                  )}
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    `/academic-coordinator/classes-details/${cls.id}`
                  )
                }
                className="milk-btn w-full"
              >
                View Details
              </button>

            </div>

          ))

        )}

      </div>

      {/* =================================================
          CREATE CLASS MODAL
      ================================================= */}
      {showCreateModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Create New Class
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add a new class to the school
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleCreateClass}
              className="p-6 space-y-5"
            >

              {/* ERROR */}
              {formError && (

                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                  {formError}
                </div>

              )}

              {/* GRADE */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>

                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="milk-input w-full"
                  required
                >

                  <option value="">
                    Select Grade
                  </option>

                  <option value="PP1">
                    PP1
                  </option>

                  <option value="PP2">
                    PP2
                  </option>

                  <option value="Grade 1">
                    Grade 1
                  </option>

                  <option value="Grade 2">
                    Grade 2
                  </option>

                  <option value="Grade 3">
                    Grade 3
                  </option>

                  <option value="Grade 4">
                    Grade 4
                  </option>

                  <option value="Grade 5">
                    Grade 5
                  </option>

                  <option value="Grade 6">
                    Grade 6
                  </option>

                  <option value="Grade 7">
                    Grade 7
                  </option>

                  <option value="Grade 8">
                    Grade 8
                  </option>

                  <option value="Grade 9">
                    Grade 9
                  </option>

                </select>

              </div>

              {/* STREAM */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stream
                </label>

                <input
                  type="text"
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  placeholder="e.g. A"
                  className="milk-input w-full"
                  required
                />

              </div>

              {/* CAPACITY */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 40"
                  min="1"
                  className="milk-input w-full"
                  required
                />

                <p className="text-xs text-gray-500 mt-1">
                  This is the maximum number of students
                  allowed in this class.
                </p>

              </div>

              {/* CLASS TEACHER */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Teacher
                </label>

                <select
                  name="class_teacher"
                  value={formData.class_teacher}
                  onChange={handleChange}
                  className="milk-input w-full"
                  required
                >

                  <option value="">
                    Select Class Teacher
                  </option>

                  {teachers.map((teacher) => (

                    <option
                      key={teacher.id}
                      value={teacher.id}
                    >
                      {teacher.name ||
                        teacher.full_name ||
                        teacher.user_name ||
                        teacher.username ||
                        `Teacher #${teacher.id}`}
                    </option>

                  ))}

                </select>

                {teachers.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No teachers available.
                  </p>
                )}

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">

                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={saving}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="milk-btn w-full disabled:opacity-50"
                >
                  {saving
                    ? "Creating Class..."
                    : "Create Class"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AcademicCoClasses;

