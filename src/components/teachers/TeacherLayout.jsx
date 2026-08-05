import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TeacherProvider } from "./TeacherContext";
import TeacherNavbar from "./TeacherNavbar";
import TeacherSidebar from "./TeacherSidebar";

const TeacherLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <TeacherProvider>
            <div className="flex relative">
                <TeacherSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed top-0 left-0 w-screen h-screen bg-black/50"
                        style={{ zIndex: 1040 }}
                        onClick={closeSidebar}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1 min-h-screen flex flex-col">
                    <TeacherNavbar onToggleSidebar={toggleSidebar} />

                    <div className="px-4 py-4 flex-1">
                        <Outlet />
                    </div>
                </div>
            </div>
        </TeacherProvider>
    );
};

export default TeacherLayout;

