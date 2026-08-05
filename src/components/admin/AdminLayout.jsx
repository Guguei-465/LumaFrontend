import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavBar from "../DashboardNavBar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <DashboardNavBar
          title="Administrator"
          setIsOpen={setIsOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 m-5">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;