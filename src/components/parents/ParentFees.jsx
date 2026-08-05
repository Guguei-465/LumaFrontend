import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../UseAvata";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-green-600"></div>
  </div>
);

const ParentFees = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFees = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      // ✅ Step 1: Get your children first (this works)
      const { data: children } = await api.get("dashboard/parent/children/");
      const childList = Array.isArray(children) ? children : [];

      if (childList.length === 0) {
        setStudents([]);
        return;
      }

      // ✅ Step 2: Fetch fees FOR EACH CHILD (authorized path)
      const feePromises = childList.map(async (child) => {
        try {
          const res = await api.get(`fees/student/${child.student_id || child.id}/`);
          return {
            ...child,
            total_fee: res.data?.total_fee || 0,
            amount_paid: res.data?.amount_paid || 0,
            balance: res.data?.balance || 0
          };
        } catch {
          return {
            ...child,
            total_fee: 0,
            amount_paid: 0,
            balance: 0
          };
        }
      });

      const allFees = await Promise.all(feePromises);
      setStudents(allFees);

    } catch (err) {
      console.error("Failed to load fee records:", err.response?.status, err.response?.data);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          Failed to load fee records. Please try again later.
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h5 className="text-xl font-bold text-gray-800">Fees</h5>
        <p className="text-sm text-gray-500 mt-1">Fee summary for all your children.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Fee</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount Paid</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Balance</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No fee records available at the moment.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.student_id || student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={{ username: student.first_name, profile_picture: student.photo }} size={36} />
                        <div>
                          <p className="font-medium text-gray-900">{student.first_name} {student.last_name}</p>
                          <p className="text-xs text-gray-500">{student.grade} {student.stream}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600">KES {Number(student.total_fee || 0).toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-600">KES {Number(student.amount_paid || 0).toLocaleString()}</td>
                    <td className="px-3 py-3 font-semibold text-red-600">KES {Number(student.balance || 0).toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <Link to={`/parent/my-children/${student.student_id || student.id}?tab=fees`} className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {students.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No fee records available at the moment.</div>
          ) : (
            students.map((student) => (
              <div key={student.student_id || student.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <UserAvatar user={{ username: student.first_name, profile_picture: student.photo }} size={40} />
                  <div>
                    <p className="font-semibold text-gray-900">{student.first_name} {student.last_name}</p>
                    <p className="text-xs text-gray-500">{student.grade} {student.stream}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-gray-500">Total Fee:</span>
                  <span className="font-medium">KES {Number(student.total_fee || 0).toLocaleString()}</span>
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-medium">KES {Number(student.amount_paid || 0).toLocaleString()}</span>
                  <span className="text-gray-500">Balance:</span>
                  <span className="font-semibold text-red-600">KES {Number(student.balance || 0).toLocaleString()}</span>
                </div>
                <Link to={`/parent/my-children/${student.student_id || student.id}?tab=fees`} className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentFees;