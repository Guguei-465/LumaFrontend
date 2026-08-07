import React from 'react'
import { NavLink } from 'react-router-dom'

const SideBar = ({ isOpen, setIsOpen }) => {
  // Reusable link styling: active highlighted, hover effect
  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-green-600 text-white shadow-md'
        : 'text-gray-200 hover:bg-white/10 hover:text-white'
    }`;

  // Section heading style
  const sectionHeading = 'text-gray-300 text-sm font-semibold uppercase tracking-wider px-3 py-2 mt-6 mb-1';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-gradient-to-br from-green-800 to-blue-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 h-full overflow-y-auto">
          {/* Branding */}
          <h2 className="text-2xl font-bold mb-8 text-center border-b border-white/20 pb-4">
            Luma 2000 Academy
          </h2>

          <nav className="space-y-1">
            {/* Core Overview */}
            <NavLink 
              to="/academic-coordinator" 
              end 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-speedometer2 text-lg"></i>
              Dashboard
            </NavLink>

            {/* Academic Management */}
            <p className={sectionHeading}>Academic Management</p>
            <NavLink 
              to="/academic-coordinator/students" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-people-fill text-lg"></i>
              Students
            </NavLink>
            <NavLink 
              to="/academic-coordinator/subjects" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-book-fill text-lg"></i>
              Subjects
            </NavLink>
            <NavLink 
              to="/academic-coordinator/assessments" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-clipboard-check text-lg"></i>
              Assessments
            </NavLink>
            <NavLink 
              to="/academic-coordinator/timetable" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-calendar3 text-lg"></i>
              Timetable
            </NavLink>
             <NavLink 
              to="/academic-coordinator/attendance" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-clipboard-check"></i> Student Attendance
            </NavLink>

            {/* Results & Grading */}
            <p className={sectionHeading}>Results & Grading</p>
            <NavLink 
              to="/academic-coordinator/result-submissions" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-upload text-lg"></i>
              Result Submissions
            </NavLink>
            <NavLink 
              to="/academic-coordinator/student-results" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-bar-chart-line-fill text-lg"></i>
              Student Results
            </NavLink>
            <NavLink 
              to="/academic-coordinator/grade-scales" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-award-fill text-lg"></i>
              Grade Scales
            </NavLink>
            <NavLink 
              to="/academic-coordinator/report-comments" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-chat-left-text-fill text-lg"></i>
              Report Comments
            </NavLink>
            <NavLink 
              to="/academic-coordinator/learning-outcomes" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-mortarboard-fill text-lg"></i>
              Learning Outcomes
            </NavLink>

            {/* Account */}
            <p className={sectionHeading}>Account</p>
            <NavLink 
              to="/academic-coordinator/profile" 
              className={linkClass} 
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-person-fill text-lg"></i>
              My Profile
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default SideBar