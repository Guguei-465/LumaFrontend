import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const RegisterStudents = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    admission_number: "", assessment_number: "",
    first_name: "", last_name: "",
    gender: "", date_of_birth: "",
    classroom: "", parent: "", photo: null,
  });

  useEffect(() => {
    api.get("accounts/parents/").then(r => setParents(r.data)).catch(console.log);
    api.get("classes/").then(r => setClassrooms(r.data)).catch(console.log);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, photo: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => { if (val) data.append(key, val); });
      await api.post("students/create/", data, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess("Student registered successfully!");
      setTimeout(() => navigate("/admin/students"), 1500);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Register New Student</h2>
        <p className="text-gray-500 mb-6">Fill in the details to register a new student.</p>

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Admission Number", name: "admission_number", type: "text", required: true },
            { label: "Assessment Number", name: "assessment_number", type: "text" },
            { label: "First Name", name: "first_name", type: "text", required: true },
            { label: "Last Name", name: "last_name", type: "text", required: true },
            { label: "Date of Birth", name: "date_of_birth", type: "date", required: true },
          ].map(({ label, name, type, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange} required={required}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classroom</label>
            <select name="classroom" value={form.classroom} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2">
              <option value="">Select Classroom</option>
              {classrooms.map(c => <option key={c.id} value={c.id}>{c.grade} {c.stream}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent / Guardian</label>
            <select name="parent" value={form.parent} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2">
              <option value="">Select Parent</option>
              {parents.map(p => <option key={p.id} value={p.id}>{p.user.first_name} {p.user.last_name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div className="md:col-span-2 mt-2">
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
              Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStudents;
