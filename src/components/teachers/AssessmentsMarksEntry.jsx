import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

const AssessmentMarksEntry = () => {
    const { id } = useParams();
    const [assessment, setAssessment] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

   const fetchAssessment = async () => {
        setLoading(true);
        try {
            const response = await api.get(
                `/dashboard/teacher/assessments/${id}/`
            );
            setAssessment(response.data.assessment);
            setStudents(response.data.students);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load assessment.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAssessment();
    }, [id]);

    useEffect(() => {
        const handler = e => {
            if(!unsavedChanges) return;
            e.preventDefault();
            e.returnValue="";
        };
        window.addEventListener("beforeunload",handler);
        return ()=>window.removeEventListener("beforeunload",handler);
    },[unsavedChanges]);

    // handle marks change
   const handleMarksChange = (studentId, value) => {
        const marks = Math.max(
            0,
            Math.min(Number(value), assessment.total_marks)
        );
        setStudents(prev =>
            prev.map(student =>
                student.student_id === studentId
                    ? { ...student, marks }
                    : student
            )
        );
        setUnsavedChanges(true);
    };

    // saves marks
    const saveMarks = async () => {
        setSaving(true);
        try {
            await api.post(
                `/dashboard/teacher/assessments/${id}/save/`,
                {
                    students,
                }
            );
            setSuccess("Marks saved successfully.");
            setError("");
            setUnsavedChanges(false);
        } catch (err) {
            console.error(err);
            setError("Unable to save marks.");
        } finally {
            setSaving(false);
        }
    };
    const filteredStudents = useMemo(() => {
        return students.filter(student =>
            `${student.student_name} ${student.admission_number}`
            .toLowerCase()
            .includes(search.toLowerCase())
        );
    }, [students, search]);
    const submitResults = async () => {
        if(
            students.some(student=>student.marks==="")
        ){
            setError("Enter marks for every student.");
            return;
        }
        setSaving(true);
        try{
            await api.post(
                `/dashboard/teacher/assessments/${id}/submit/`,
                {students}
            );
            setSuccess("Results submitted successfully.");
            setUnsavedChanges(false);
        }catch(err){
            console.error(err);
            setError("Unable to submit results.");
        }finally{
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-5"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    return (
        <>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div>
                    <h3 className="font-bold text-lg mb-1">
                        {assessment?.subject}
                    </h3>
                    <span className="text-xs text-gray-500">
                        {assessment?.assessment_type} • {assessment?.classroom}
                    </span>
                </div>
                <button
                    className="border border-blue-600 text-blue-600 rounded-lg px-4 py-2 text-sm hover:bg-blue-50 transition"
                    onClick={fetchAssessment}  >
                    <i className="bi bi-arrow-clockwise mr-2"></i>
                    Refresh
                </button>
            </div>
            <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search student..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />
            {success &&
                <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-4 mb-4">
                    {success}
                </div>
            }
            {error &&
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 mb-4">
                    {error}
                </div>
            }

            <div className="flex justify-end mb-3 gap-2">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    disabled={!unsavedChanges || saving}
                    onClick={saveMarks}
                >
                    {saving ? "Saving..." : "Save Draft"}
                </button>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    onClick={()=>{
                        if(
                            window.confirm(
                                "Submit results? You won't be able to edit them afterwards."
                            )
                        ){
                            submitResults();
                        }
                    }}
                    disabled={saving}
                >
                    {saving ? "Submitting Result..." : "Submit Results"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg shadow border p-4 text-center">
                    <h4 className="text-lg font-bold">{students.length}</h4>
                    <span className="text-xs text-gray-500">Students</span>
                </div>
                <div className="bg-white rounded-lg shadow border p-4 text-center">
                    <h4 className="text-lg font-bold">{students.filter(s=>s.marks!=="").length}</h4>
                    <span className="text-xs text-gray-500">Completed</span>
                </div>
                <div className="bg-white rounded-lg shadow border p-4 text-center">
                    <h4 className="text-lg font-bold">{students.filter(s=>s.marks==="").length}</h4>
                    <span className="text-xs text-gray-500">Pending</span>
                </div>
            </div>

            <div className="mb-4">
                    <strong className="text-sm">
                    Completed {students.filter(s=>s.marks!=="").length}/{students.length}
                    </strong>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all"
                        style={{
                            width:`${
                                students.length > 0
                                    ? (students.filter(s=>s.marks!=="").length / students.length) * 100
                                    : 0
                            }%`
                        }}
                    >
                    </div>
                    </div>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admission</th>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marks (max: {assessment?.total_marks})</th>
                            <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                            <tr key={student.student_id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-600">{student.admission_number}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.student_name}</td>
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        className="w-24 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={student.marks}
                                        min="0"
                                        max={assessment?.total_marks}
                                        onChange={(e)=>
                                            handleMarksChange(student.student_id,e.target.value)
                                        }
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                            student.marks === ""
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-green-100 text-green-800"
                                        }`}
                                    >
                                        {student.marks === ""
                                            ? "Pending"
                                            : "Completed"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AssessmentMarksEntry;

