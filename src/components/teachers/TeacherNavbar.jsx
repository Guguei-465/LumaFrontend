import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTeacher } from "./TeacherContext";
import UserAvatar from "../UseAvata";

const TeacherNavbar = ({ onToggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const { dashboard } = useTeacher();

    return (
        <nav className="bg-white border-b shadow-sm px-4">
            <div className="flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-3">
                    {/* Hamburger button - visible on mobile only */}
                    <button
                        className="border border-gray-300 rounded px-2 py-1 text-sm hover:bg-gray-100 lg:hidden"
                        onClick={onToggleSidebar}
                    >
                        <i className="bi bi-list text-lg"></i>
                    </button>

                    <div>
                        <h5 className="font-bold text-base mb-0">
                            Teacher Dashboard
                        </h5>

                        <span className="text-xs text-gray-500">
                            Welcome back, {dashboard?.teacher_name || user?.first_name}
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">

                    <button className="relative border border-gray-300 rounded px-2 py-1 hover:bg-gray-100">
                        <i className="bi bi-bell-fill text-base"></i>

                        <span className="absolute -top-1 -right-1 translate-x-1/2 -translate-y-1/2 badge rounded-full bg-red-600 text-white text-xs px-1.5 py-0.5">
                            {dashboard?.unread_notifications ?? 0}
                        </span>
                    </button>

                    <div className="flex items-center">
                        <UserAvatar
                            user={user}
                            size={45}
                        />

                        <div className="ml-2 hidden md:block">
                            <div className="font-semibold text-sm">
                                {user?.first_name} {user?.last_name}
                            </div>

                            <span className="text-xs text-gray-500">
                                {dashboard?.is_class_teacher
                                    ? "Class Teacher"
                                    : "Subject Teacher"}
                            </span>
                        </div>
                    </div>

                    <button
                        className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1.5 text-sm"
                        onClick={logout}
                    >
                        <i className="bi bi-box-arrow-right mr-2 hidden sm:inline"></i>
                        <i className="bi bi-box-arrow-right sm:hidden"></i>
                    </button>

                </div>

            </div>
        </nav>
    );
};

export default TeacherNavbar;
