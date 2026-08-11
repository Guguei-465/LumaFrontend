import { useEffect, useState } from "react";
import api from "../api/api";

const LearningOutcomes = () => {
  const [outcomes, setOutcomes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    subject: "",
    name: "",
    description: "",
    maximum_marks: "",
  });

  // =====================================================
  // FETCH LEARNING OUTCOMES
  // =====================================================
  const fetchOutcomes = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "results/learning-outcomes/"
      );

      const data =
        res.data.results || res.data;

      setOutcomes(data);
      setFiltered(data);
    } catch (error) {
      console.error(
        "Failed to load learning outcomes:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH SUBJECTS
  // =====================================================
  const fetchSubjects = async () => {
    try {
      const res = await api.get("subjects/");

      const data =
        res.data.results || res.data;

      setSubjects(data);
    } catch (error) {
      console.error(
        "Failed to load subjects:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {
    fetchOutcomes();
    fetchSubjects();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================
  useEffect(() => {
    const data = outcomes.filter(
      (item) =>
        item.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.description
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFiltered(data);
  }, [search, outcomes]);

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================
  const openAddModal = () => {
    setEditing(false);

    setFormData({
      id: "",
      subject: "",
      name: "",
      description: "",
      maximum_marks: "",
    });

    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================
  const openEditModal = (outcome) => {
    setEditing(true);

    setFormData({
      id: outcome.id,
      subject: outcome.subject || "",
      name: outcome.name || "",
      description: outcome.description || "",
      maximum_marks:
        outcome.maximum_marks || "",
    });

    setShowModal(true);
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const payload = {
        subject: Number(formData.subject),

        name: formData.name.trim(),

        description:
          formData.description.trim(),

        maximum_marks: Number(
          formData.maximum_marks
        ),
      };

      console.log(
        "Learning Outcome Payload:",
        payload
      );

      // =================================================
      // UPDATE
      // =================================================
      if (editing) {
        await api.put(
          `results/learning-outcomes/${formData.id}/`,
          payload
        );
      }

      // =================================================
      // CREATE
      // =================================================
      else {
        await api.post(
          "results/learning-outcomes/",
          payload
        );
      }

      // Refresh list
      await fetchOutcomes();

      // Close modal
      setShowModal(false);

      // Reset form
      setFormData({
        id: "",
        subject: "",
        name: "",
        description: "",
        maximum_marks: "",
      });
    } catch (err) {
      console.error(
        "Save failed:",
        err
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      console.error(
        "Status:",
        err.response?.status
      );

      alert(
        err.response?.data
          ? JSON.stringify(
              err.response.data,
              null,
              2
            )
          : "Could not save learning outcome!"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================
  const deleteOutcome = async (id) => {
    if (
      !window.confirm(
        "Delete this learning outcome?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `results/learning-outcomes/${id}/`
      );

      await fetchOutcomes();
    } catch (err) {
      console.error(
        "Delete failed:",
        err
      );

      console.error(
        "Backend response:",
        err.response?.data
      );
    }
  };

  return (
    <div className="p-6">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Learning Outcomes
          </h1>

          <p className="text-gray-500 mt-1">
            Manage CBC learning outcomes and competencies
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="milk-btn mt-4 md:mt-0"
        >
          <i className="bi bi-plus-circle mr-2"></i>
          Add Outcome
        </button>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}
      <div className="card mb-6">

        <div className="relative max-w-md">

          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>

          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="milk-input pl-10"
          />

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}
      <div className="card overflow-x-auto">

        {loading ? (

          <div className="text-center py-16 text-gray-500">

            <i className="bi bi-arrow-repeat animate-spin text-2xl mb-2"></i>

            <p>
              Loading learning outcomes...
            </p>

          </div>

        ) : filtered.length === 0 ? (

          <div className="text-center py-10 text-gray-500">

            {search
              ? "No matching outcomes found."
              : "No learning outcomes defined yet."}

          </div>

        ) : (

          <table className="w-full text-left">

            <thead>

              <tr className="border-b-2 border-green-200">

                <th className="px-4 py-3 text-green-700 font-semibold">
                  Subject
                </th>

                <th className="px-4 py-3 text-green-700 font-semibold">
                  Learning Outcome
                </th>

                <th className="px-4 py-3 text-green-700 font-semibold">
                  Description
                </th>

                <th className="px-4 py-3 text-green-700 font-semibold text-center">
                  Max Marks
                </th>

                <th className="px-4 py-3 text-green-700 font-semibold text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((outcome) => {

                // Find subject name from subject ID
                const subject = subjects.find(
                  (s) =>
                    Number(s.id) ===
                    Number(outcome.subject)
                );

                return (
                  <tr
                    key={outcome.id}
                    className="border-b border-gray-100 hover:bg-green-50"
                  >

                    {/* SUBJECT */}
                    <td className="px-4 py-3">
                      {subject?.name ||
                        `Subject ${outcome.subject}`}
                    </td>

                    {/* NAME */}
                    <td className="px-4 py-3 font-medium">
                      {outcome.name}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-4 py-3">
                      {outcome.description}
                    </td>

                    {/* MAXIMUM MARKS */}
                    <td className="px-4 py-3 text-center">
                      {outcome.maximum_marks}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 text-center">

                      <div className="flex justify-center gap-4">

                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              outcome
                            )
                          }
                          className="text-green-600 hover:text-green-800 text-lg"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            deleteOutcome(
                              outcome.id
                            )
                          }
                          className="text-red-600 hover:text-red-800 text-lg"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        )}

      </div>

      {/* =================================================
          MODAL
      ================================================= */}
      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">

            {/* =================================================
                MODAL HEADER
            ================================================= */}
            <div className="flex justify-between items-center border-b border-green-200 px-6 py-4">

              <h3 className="text-xl font-semibold">

                {editing
                  ? "Edit Learning Outcome"
                  : "Add New Outcome"}

              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="text-red-500 hover:text-red-700"
              >
                <i className="bi bi-x-circle-fill text-2xl"></i>
              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              {/* SUBJECT */}
              <div>

                <label className="form-lable">
                  Subject{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="milk-input"
                >

                  <option value="">
                    -- Select Subject --
                  </option>

                  {subjects.map(
                    (subject) => (
                      <option
                        key={subject.id}
                        value={subject.id}
                      >
                        {subject.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* NAME */}
              <div>

                <label className="form-lable">
                  Learning Outcome Name{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="milk-input"
                  placeholder="e.g. Fractions"
                />

              </div>

              {/* DESCRIPTION */}
              <div>

                <label className="form-lable">
                  Description{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  name="description"
                  rows={4}
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  required
                  className="milk-input"
                  placeholder="e.g. Understanding fractions"
                />

              </div>

              {/* MAXIMUM MARKS */}
              <div>

                <label className="form-lable">
                  Maximum Marks{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="number"
                  name="maximum_marks"
                  value={
                    formData.maximum_marks
                  }
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  className="milk-input"
                  placeholder="e.g. 20"
                />

              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="milk-btn px-5"
                  disabled={saving}
                >

                  {saving ? (

                    <span className="flex items-center gap-2">

                      <i className="bi bi-arrow-repeat animate-spin"></i>

                      Saving...

                    </span>

                  ) : (

                    editing
                      ? "Update"
                      : "Save"

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default LearningOutcomes;