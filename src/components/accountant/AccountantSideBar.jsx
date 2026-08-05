import React from "react";
import { NavLink } from "react-router-dom";

const AccountantSideBar = ({ isOpen, setIsOpen }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-3 py-3 rounded-lg transition ${
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
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-gradient-to-br from-green-800 to-blue-900 text-white transform transition-transform duration-300 ${
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
            <NavLink to="/accountant" end className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-speedometer2"></i>
              Dashboard
            </NavLink>
            <NavLink to="/accountant/fee-structures" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-cash-stack"></i>
              Fee Structures
            </NavLink>
            <NavLink to="/accountant/student-fees" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-people-fill"></i>
              Student Fees
            </NavLink>
            <NavLink to="/accountant/fee-payments" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-credit-card-fill"></i>
              Fee Payments
            </NavLink>
            <NavLink to="/accountant/notices" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-megaphone-fill"></i>
              Fee Notices
            </NavLink>
            <NavLink to="/accountant/reports" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-bar-chart-fill"></i>
              Financial Reports
            </NavLink>
            <NavLink to="/accountant/profile" className={linkClass} onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-fill"></i>
              My Profile
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AccountantSideBar;