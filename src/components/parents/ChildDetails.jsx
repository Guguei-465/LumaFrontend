import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import UserAvatar from "../UseAvata";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-green-600"></div>
  </div>
);

const ChildDetail = () => {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = useCallback(async () => {
    try {
      const res = await api.get(`/dashboard/parent/children/${studentId}/`);
      setStudent(res.data);
    } catch (err) {
      console.error("Failed to load student:", err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { fetchStudent(); }, [fetchStudent]);

  if (loading) return <Spinner />;
  if (!student) return <p className="text-center py-10 text-gray-500">Student not found.</p>;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "fees", label: "Fees" },
    { key: "payments", label: "Payments" },
    { key: "attendance", label: "Attendance" },
    { key: "results", label: "Results" },
    { key: "reports", label: "Report Cards" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <UserAvatar user={{ username: student.first_name, profile_picture: student.photo }} size={60} />
          <div>
            <h3 className="text-xl font-bold text-gray-800">{student.first_name} {student.last_name}</h3>
            <p className="text-gray-500">{student.grade} {student.stream} • Adm: {student.admission_number}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {tabs.map((t) => (
            <Link
              key={t.key}
              to={`/parent/my-children/${studentId}?tab=${t.key}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.key ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tab Content — ready for your existing components */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-600">Select a tab above to view details.</p>
          </div>
        )}
        {/* Other tabs will render your existing Fee/Payment/Attendance/Result components */}
      </div>
    </div>
  );
};

export default ChildDetail;