import { NavLink } from "react-router-dom";

const AdminSideBar = ({ isOpen, setIsOpen }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-3 py-3 rounded-lg transition ${
      isActive
        ? "bg-teal-600 text-white shadow-md"
        : "text-teal-950 hover:bg-teal-200/60 hover:text-teal-900"
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
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-gradient-to-br from-teal-900 to-teal-500 text-black transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-2 text-teal-950">
            Luma 2000 Academy
          </h2>
          <p className="text-xs font-semibold text-teal-900 mb-6 uppercase tracking-wide">
            Admin Panel
          </p>

          <nav className="space-y-2">
            <NavLink to="/admin-dashboard" end className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-speedometer2"></i> Dashboard
            </NavLink>

            <p className="pt-3 text-xs uppercase tracking-wider text-teal-900 font-semibold">Students</p>
            <NavLink to="/admin-dashboard/students" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-people-fill"></i> Students List
            </NavLink>
            <NavLink to="/admin-dashboard/students/add" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-plus-fill"></i> Register Student
            </NavLink>

            <p className="pt-3 text-xs uppercase tracking-wider text-teal-900 font-semibold">Teachers</p>
            <NavLink to="/admin-dashboard/teachers" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-workspace"></i> Teachers List
            </NavLink>
            <NavLink to="/admin-dashboard/teachers/add" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-plus-fill"></i> Add Teacher
            </NavLink>

            <p className="pt-3 text-xs uppercase tracking-wider text-teal-900 font-semibold">Parents</p>
            <NavLink to="/admin-dashboard/parents" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-people-fill"></i> Parents List
            </NavLink>
            <NavLink to="/admin-dashboard/parents/add" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-plus-fill"></i> Add Parent
            </NavLink>

            <p className="pt-3 text-xs uppercase tracking-wider text-teal-900 font-semibold">Fees</p>
            <NavLink to="/admin-dashboard/fees/structures" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-journal-text"></i> Fee Structures
            </NavLink>
            <NavLink to="/admin-dashboard/fees/structures/add" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-journal-plus"></i> New Fee Structure
            </NavLink>
            <NavLink to="/admin-dashboard/fees/payments" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-cash-stack"></i> Fee Payments
            </NavLink>
            <NavLink to="/admin-dashboard/fees/payments/record" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-cash-coin"></i> Record Payment
            </NavLink>

            <p className="pt-3 text-xs uppercase tracking-wider text-teal-900 font-semibold">Academics</p>
            <NavLink to="/admin-dashboard/attendance" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-calendar-check"></i> Daily Attendance
            </NavLink>
            <NavLink to="/admin-dashboard/attendance/reports" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-clipboard-data"></i> Attendance Reports
            </NavLink>
            <NavLink to="/admin-dashboard/exams" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-pencil-square"></i> Exams & Tests
            </NavLink>
            <NavLink to="/admin-dashboard/exams/add" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-file-earmark-plus"></i> Create Exam
            </NavLink>

            <p className="pt-3 text-xs uppercase tracking-wider text-teal-900 font-semibold">System</p>
            <NavLink to="/admin-dashboard/users" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-people-fill"></i> All Users
            </NavLink>
            <NavLink to="/admin-dashboard/notices" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-megaphone-fill"></i> Notices
            </NavLink>
            <NavLink to="/admin-dashboard/profile" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-fill"></i> My Profile
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSideBar;
