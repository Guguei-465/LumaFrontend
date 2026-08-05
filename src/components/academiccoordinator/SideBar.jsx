import React from 'react'
import { NavLink } from 'react-router-dom'

const SideBar = ({ isOpen, setIsOpen }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-3 py-2 rounded-lg transition ${
      isActive
        ? 'bg-green-600 text-white'
        : 'text-gray-200 hover:bg-white/10'
    }`

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-gradient-to-br from-green-800 to-blue-900 text-white transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-8">
            Luma 2000 Academy
          </h2>

          <nav className="space-y-2">

            <NavLink to="/academic-coordinator" end className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-speedometer2"></i>
              Dashboard
            </NavLink>
            <NavLink to="/academic-coordinator/students" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-people-fill"></i>
              Students
            </NavLink>
            <NavLink to="/academic-coordinator/subjects" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-book-fill"></i>
              Subjects
            </NavLink>
            <NavLink to="/academic-coordinator/assessments" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-clipboard-check"></i>
              Assessments
            </NavLink>
            <NavLink to="/academic-coordinator/timetable" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-calendar3"></i>
              Timetable
            </NavLink>
            <NavLink to="/academic-coordinator/result-submissions" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-upload"></i>
              Result Submissions
            </NavLink>
            <NavLink to="/academic-coordinator/student-results" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-bar-chart-line-fill"></i>
              Student Results
            </NavLink>
            <NavLink to="/academic-coordinator/grade-scales" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-award-fill"></i>
              Grade Scales
            </NavLink>
            <NavLink to="/academic-coordinator/report-comments" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-chat-left-text-fill"></i>
              Report Comments
            </NavLink>
            <NavLink to="/academic-coordinator/learning-outcomes" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-mortarboard-fill"></i>
              Learning Outcomes
            </NavLink>
            <NavLink to="/academic-coordinator/profile" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-fill"></i>
              My Profile
            </NavLink>

          </nav>
        </div>
      </aside>
    </>
  )
}

export default SideBar