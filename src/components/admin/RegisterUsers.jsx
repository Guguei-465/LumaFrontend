import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const RegisterUsers = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 

  const [formData, setFormData] = useState({
    photo: null, first_name: "", last_name: "", username: "",
    email: "", phone_number: "", gender: "", date_of_birth: "", qualification: "", role: "",
    employee_number: "", national_id: "",
    classroom: "", subject: "", is_class_teacher: false,
    password: "", confirm_password: "",
  });

  useEffect(() => {
    api.get("classes/").then(r => { const d = Array.isArray(r.data) ? r.data : r.data.results || []; setClassrooms(d); }).catch(console.log);
    api.get("subjects/").then(r => { const d = Array.isArray(r.data) ? r.data : r.data.results || []; setSubjects(d); }).catch(console.log);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, photo: files[0] });
      if (files[0]) setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match"); return;
    }
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key !== "confirm_password" && val !== null && val !== "") data.append(key, val);
      });
      await api.post("accounts/register/", data, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess("User registered successfully!");
      setTimeout(() => navigate("/admin/users"), 1500);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Registration failed");
    }
  };
 

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">Register User</h1>
        <p className="text-gray-500 mt-1">Create teachers, accountants, academic coordinators and administrators.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        {/* Photo */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-4 border-green-500 overflow-hidden bg-gray-100">
            {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400"><i className="bi bi-person-fill"></i></div>}
          </div>
          <label className="mt-3 cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
            Upload Photo
            <input type="file" hidden accept="image/*" name="photo" onChange={handleChange} />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            { label: "First Name", name: "first_name", type: "text", required: true },
            { label: "Last Name", name: "last_name", type: "text", required: true },
            { label: "Username", name: "username", type: "text", required: true },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phone_number", type: "text" },
            { label: "Password", name: "password", type: "password", required: true },
            { label: "Confirm Password", name: "confirm_password", type: "password", required: true },
          ].map(({ label, name, type, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} name={name} value={formData[name]} onChange={handleChange} required={required}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Select Role</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ACADEMIC_COORDINATOR">Academic Coordinator</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="TEACHER">Teacher</option>
              <option value="PARENT">Parent</option>
            </select>
          </div>

          {formData.role === "TEACHER" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
                <input type="text" name="employee_number" value={formData.employee_number} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                <input type="text" name="national_id" value={formData.national_id} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                <textarea name="qualification" value={formData.qualification} onChange={handleChange} rows="3"
                  placeholder="e.g. B.Ed Mathematics, PGDE..."
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Class</label>
                <select name="classroom" value={formData.classroom} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  <option value="">Select Classroom</option>
                  {classrooms.map(c => <option key={c.id} value={c.id}>{c.grade} {c.stream}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterUsers;
