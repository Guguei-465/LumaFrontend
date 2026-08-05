import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ isOpen, setIsOpen }) => {

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-200 hover:bg-white/10"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-gradient-to-br from-blue-800 to-blue-900 text-white transform transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >

        <div className="p-5">

          <h2 className="text-2xl font-bold mb-8">
            Luma 2000 Academy
          </h2>

          <nav className="space-y-2">

            <NavLink to="/admin" end className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-speedometer2"></i>
              Dashboard
            </NavLink>
            <NavLink to="/admin/register-user" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-plus-fill"></i>
              Register User
            </NavLink>
            <NavLink to="/admin/register-student" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-vcard-fill"></i>
              Register Student
            </NavLink>
            <NavLink to="/admin/users" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-people-fill"></i>
              Users
            </NavLink>
            <NavLink to="/admin/teachers" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-workspace"></i>
              Teachers
            </NavLink>
            <NavLink to="/admin/parents" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-people"></i>
              Parents
            </NavLink>
            <NavLink to="/admin/students" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-mortarboard-fill"></i>
              Students
            </NavLink>
            <NavLink to="/admin/classes" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-building"></i>
              Classes
            </NavLink>
            <NavLink to="/admin/subjects" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-book-fill"></i>
              Subjects
            </NavLink>
            <NavLink to="/admin/timetable" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-calendar3"></i>
              Timetable
            </NavLink>
            <NavLink to="/admin/announcements" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-megaphone-fill"></i>
              Announcements
            </NavLink>
            <NavLink to="/admin/fees" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-cash-stack"></i>
              Fee Structures
            </NavLink>
            <NavLink to="/admin/payments" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-credit-card-fill"></i>
              Payments
            </NavLink>
            <NavLink to="/admin/reports" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-file-earmark-bar-graph-fill"></i>
              Reports
            </NavLink>
            <NavLink to="/admin/profile" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-circle"></i>
              My Profile
            </NavLink>

          </nav>

        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;