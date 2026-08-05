import React, { useEffect, useState } from 'react'
import { Search, Users } from 'lucide-react'
import api from '../api/api'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('access_token')

      const res = await api.get(
        'students/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setStudents(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name} ${student.admission_number}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-gray-500">
            View learners and fee records.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="font-semibold">
            {students.length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search student..."
            className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Admission No</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Parent</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    {student.admission_number}
                  </td>

                  <td className="p-3">
                    {student.first_name} {student.last_name}
                  </td>

                  <td className="p-3">
                    {student.classroom_name}
                  </td>

                  <td className="p-3">
                    {student.parent_name}
                  </td>

                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                      {student.status}
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

export default Students