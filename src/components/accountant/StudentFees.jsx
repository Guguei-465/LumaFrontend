import React, { useEffect, useState } from 'react'


const StudentFees = () => {
  const [studentFees, setStudentFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchStudentFees()
  }, [])

  const fetchStudentFees = async () => {
    try {
      const token = localStorage.getItem('access_token')

      const res = await api.get(
        'fees/student-fees/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setStudentFees(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredFees = studentFees.filter((fee) =>
    `${fee.student_name} ${fee.admission_number}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Student Fees</h1>
          <p className="text-gray-500">
            View each student's fee balance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
          <CreditCard size={20} />
          <span>{studentFees.length} Records</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search student..."
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
              <th className="text-left p-3">Admission No</th>
              <th className="text-left p-3">Student</th>
              <th className="text-left p-3">Class</th>
              <th className="text-left p-3">Expected</th>
              <th className="text-left p-3">Paid</th>
              <th className="text-left p-3">Balance</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : filteredFees.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8">
                  No student fee records found.
                </td>
              </tr>
            ) : (
              filteredFees.map((fee) => (
                <tr
                  key={fee.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    {fee.admission_number}
                  </td>

                  <td className="p-3">
                    {fee.student_name}
                  </td>

                  <td className="p-3">
                    {fee.classroom_name}
                  </td>

                  <td className="p-3">
                    KES {Number(fee.total_fee).toLocaleString()}
                  </td>

                  <td className="p-3 text-green-600 font-medium">
                    KES {Number(fee.amount_paid).toLocaleString()}
                  </td>

                  <td className="p-3 text-red-600 font-medium">
                    KES {Number(fee.balance).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        fee.balance > 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {fee.balance > 0 ? 'Pending' : 'Cleared'}
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

export default StudentFees