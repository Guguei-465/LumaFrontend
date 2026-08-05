import React, { useEffect, useState } from 'react'
import api from '../api/api'

const FeeStructures = () => {
  const [feeStructures, setFeeStructures] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchFeeStructures()
  }, [])

  const fetchFeeStructures = async () => {
    try {
      const token = localStorage.getItem('access_token')

      const res = await api.get(
        'fees/fee-structures/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setFeeStructures(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredFeeStructures = feeStructures.filter((fee) =>
    `${fee.classroom_name} ${fee.term} ${fee.academic_year}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Fee Structures</h1>
          <p className="text-gray-500">
            Manage school fee structures.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          <i className="bi bi-plus-circle-fill"></i>
          Add Fee Structure
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="relative">
          <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search fee structure..."
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Class</th>
              <th className="text-left p-3">Academic Year</th>
              <th className="text-left p-3">Term</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : filteredFeeStructures.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  No fee structures found.
                </td>
              </tr>
            ) : (
              filteredFeeStructures.map((fee) => (
                <tr
                  key={fee.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{fee.classroom_name}</td>
                  <td className="p-3">{fee.academic_year}</td>
                  <td className="p-3">{fee.term}</td>
                  <td className="p-3">
                    KES {Number(fee.amount).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                      Active
                    </span>
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

export default FeeStructures