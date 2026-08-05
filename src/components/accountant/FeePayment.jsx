import React, { useEffect, useState } from 'react'
import api from '../api/api'

const FeePayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('access_token')

      const res = await api.get(
        'fees/fee-payments/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setPayments(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter((payment) =>
    `${payment.student_name} ${payment.receipt_number} ${payment.payment_method}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Fee Payments</h1>
          <p className="text-gray-500">
            Manage and monitor student fee payments.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search payment..."
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Receipt</th>
              <th className="text-left p-3">Student</th>
              <th className="text-left p-3">Method</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Recorded By</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  No fee payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {payment.receipt_number}
                  </td>

                  <td className="p-3">
                    {payment.student_name}
                  </td>

                  <td className="p-3">
                    {payment.payment_method}
                  </td>

                  <td className="p-3 text-green-600 font-semibold">
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      {Number(payment.amount).toLocaleString()}
                    </div>
                  </td>

                  <td className="p-3">
                    {payment.payment_date}
                  </td>

                  <td className="p-3">
                    {payment.recorded_by_name}
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default FeePayments