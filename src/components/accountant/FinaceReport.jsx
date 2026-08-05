import React from 'react'

const FinanceReport = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Finance Reports
          </h1>
          <p className="text-gray-500">
            View and generate financial reports.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Expected Revenue</p>
            <h2 className="text-2xl font-bold mt-2">
              KES 0
            </h2>
          </div>
          <DollarSign className="text-green-600 w-10 h-10" />
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Collected</p>
            <h2 className="text-2xl font-bold mt-2">
              KES 0
            </h2>
          </div>
          <CreditCard className="text-blue-600 w-10 h-10" />
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Outstanding</p>
            <h2 className="text-2xl font-bold mt-2">
              KES 0
            </h2>
          </div>
          <TrendingUp className="text-red-600 w-10 h-10" />
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Students Paid</p>
            <h2 className="text-2xl font-bold mt-2">
              0
            </h2>
          </div>
          <Users className="text-purple-600 w-10 h-10" />
        </div>

      </div>

      {/* Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <BarChart3 className="text-green-600 mb-4" size={40} />
          <h2 className="font-semibold text-lg mb-2">
            Fee Collection Report
          </h2>
          <p className="text-gray-500 mb-4">
            View total fees collected by term, class and academic year.
          </p>

          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Generate
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <DollarSign className="text-blue-600 mb-4" size={40} />
          <h2 className="font-semibold text-lg mb-2">
            Outstanding Balances
          </h2>
          <p className="text-gray-500 mb-4">
            Display students with pending fee balances.
          </p>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Generate
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <CreditCard className="text-purple-600 mb-4" size={40} />
          <h2 className="font-semibold text-lg mb-2">
            Payment History
          </h2>
          <p className="text-gray-500 mb-4">
            Generate a complete fee payment history report.
          </p>

          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Generate
          </button>
        </div>

      </div>

    </div>
  )
}

export default FinanceReport