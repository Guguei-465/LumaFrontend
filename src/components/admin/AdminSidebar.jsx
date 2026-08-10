import { NavLink } from "react-router-dom";

const AdminSideBar = ({ isOpen, setIsOpen }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-teal-600 text-white shadow-md"
        : "text-teal-950 hover:bg-teal-200/60 hover:text-teal-900"
    }`;

  const navItems = [
    { to: "/admin-dashboard", end: true, icon: "bi bi-speedometer2", label: "Dashboard" },
    { to: "/admin-dashboard/students", icon: "bi bi-people-fill", label: "Students" },
    { to: "/admin-dashboard/teachers", icon: "bi bi-person-workspace", label: "Teachers" },
    { to: "/admin-dashboard/parents", icon: "bi bi-people", label: "Parents" },
    { to: "/admin-dashboard/fees", icon: "bi bi-cash-coin", label: "Fees" },
    { to: "/admin-dashboard/attendance", icon: "bi bi-calendar-check", label: "Attendance" },
    { to: "/admin-dashboard/exams", icon: "bi bi-pencil-square", label: "Exams" },
    { to: "/admin-dashboard/users", icon: "bi bi-person-badge", label: "Users" },
    { to: "/admin-dashboard/notices", icon: "bi bi-megaphone-fill", label: "Notices" },
    { to: "/admin-dashboard/profile", icon: "bi bi-person-fill", label: "Profile" },
  ];

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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <i className="bi bi-mortarboard-fill text-xl text-white"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight text-white">
                Luma 2000 Academy
              </h2>
              <p className="text-xs font-semibold text-teal-200 uppercase tracking-wide">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSideBar;
