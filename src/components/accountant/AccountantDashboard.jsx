import React from 'react'

const AccountantDashboard = () => {
  return (
    <div className="space-y-6">

      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800">Accountant Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage school fees, payments and financial reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Students</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>
          <i className="bi bi-people-fill text-4xl text-blue-600"></i>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Expected Fees</p>
            <h2 className="text-3xl font-bold mt-2">KES 0</h2>
          </div>
          <i className="bi bi-cash-stack text-4xl text-green-600"></i>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Collected</p>
            <h2 className="text-3xl font-bold mt-2">KES 0</h2>
          </div>
          <i className="bi bi-credit-card-fill text-4xl text-purple-600"></i>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Balance</p>
            <h2 className="text-3xl font-bold mt-2">KES 0</h2>
          </div>
          <i className="bi bi-graph-up-arrow text-4xl text-red-500"></i>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-lg">Recent Fee Payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Student</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">No fee payments found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-lg">Outstanding Balances</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-16">
            <i className="bi bi-exclamation-circle-fill text-5xl text-orange-500 mb-4"></i>
            <p className="text-gray-500">No outstanding balances.</p>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <i className="bi bi-file-earmark-bar-graph-fill text-2xl text-indigo-600"></i>
          <h2 className="text-xl font-semibold">Financial Reports</h2>
        </div>
        <p className="text-gray-500 mb-6">Generate income summaries, payment reports and fee balances.</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">Generate Report</button>
      </div>

    </div>
  )
}

export default AccountantDashboard