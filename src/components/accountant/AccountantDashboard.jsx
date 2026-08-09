import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import FeedbackAlert from '../ui/FeedbackAlert'

// --- Reusable Spinner ---
const Spinner = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
)

const AccountantDashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    total_expected: 0,
    total_collected: 0,
    total_balance: 0
  })
const [recentPayments, setRecentPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  // --- Fetch Dashboard Data ---
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError("")

      // Load main stats
      const statsRes = await api.get("fees/dashboard-stats/")
      setStats({
        total_students: statsRes.data.total_students || 0,
        total_expected: statsRes.data.total_expected || 0,
        total_collected: statsRes.data.total_collected || 0,
        total_balance: statsRes.data.total_pending || statsRes.data.total_balance || 0
      })

      // Load recent payments (last 5)
      const paymentsRes = await api.get("fees/payments/?limit=5")
      setRecentPayments(paymentsRes.data.results || paymentsRes.data || [])

    } catch (err) {
      console.error("Dashboard load failed:", err)
      setError("Could not load dashboard data. Refresh to try again.")
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
    fetchDashboardData()
  }, [])

  // --- Refresh handler with loading + feedback ---
  const handleRefresh = async () => {
    setRefreshing(true)
    setSuccess("")
    await fetchDashboardData()
    setRefreshing(false)
    setSuccess("Dashboard refreshed successfully!")
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
<div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold text-gray-800">Accountant Dashboard</h1>
        <p className="text-gray-500 mt-3 text-lg">Manage school fees, payments and financial reports.</p>
        <div className="mt-4">
          {success && <FeedbackAlert type="success" message={success} onDismiss={() => setSuccess("")} />}
          {error && <FeedbackAlert type="error" message={error} onDismiss={() => setError("")} />}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500 text-lg">Students</p>
          <h2 className="text-4xl font-bold mt-3">{stats.total_students.toLocaleString()}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500 text-lg">Expected Fees</p>
          <h2 className="text-4xl font-bold mt-3 text-green-600">KES {stats.total_expected.toLocaleString()}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500 text-lg">Collected</p>
          <h2 className="text-4xl font-bold mt-3 text-purple-600">KES {stats.total_collected.toLocaleString()}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500 text-lg">Outstanding Balance</p>
          <h2 className="text-4xl font-bold mt-3 text-red-500">KES {stats.total_balance.toLocaleString()}</h2>
        </div>
      </div>

      {/* Recent Payments + Outstanding */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Payments Table */}
        <div className="bg-white rounded-xl shadow">
<div className="border-b px-8 py-6 flex justify-between items-center">
            <h2 className="font-semibold text-xl">Recent Fee Payments</h2>
            <button onClick={handleRefresh} disabled={refreshing} className="text-base text-blue-600 hover:underline disabled:opacity-60">
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="overflow-x-auto p-6">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-4 text-lg">Student</th>
                  <th className="text-left p-4 text-lg">Amount</th>
                  <th className="text-left p-4 text-lg">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-gray-500 text-lg">No fee payments found.</td>
                  </tr>
                ) : (
                  recentPayments.map((pay, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-4 text-lg">{pay.student_name || "—"}</td>
                      <td className="p-4 text-lg">KES {Number(pay.amount_paid).toLocaleString()}</td>
                      <td className="p-4 text-lg">{new Date(pay.payment_date).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outstanding Summary */}
        <div className="bg-white rounded-xl shadow">
          <div className="border-b px-8 py-6">
            <h2 className="font-semibold text-xl">Outstanding Balances</h2>
          </div>
          {stats.total_balance > 0 ? (
            <div className="p-10 text-center">
              <p className="text-2xl font-bold text-orange-600">KES {stats.total_balance.toLocaleString()}</p>
              <p className="text-gray-500 mt-4 text-lg">Total unpaid fees pending collection</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-green-600 font-medium text-lg">No outstanding balances.</p>
            </div>
          )}
        </div>
      </div>

      {/* Financial Reports Section */}
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-xl font-semibold text-indigo-600 mb-5">Financial Reports</h2>
        <p className="text-gray-500 mb-8 text-lg">Generate income summaries, payment reports and fee balances.</p>
<button onClick={() => navigate("/accountant/financial-reports")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition text-lg">
          Generate Report
        </button>
      </div>
    </div>
  )
}

export default AccountantDashboard