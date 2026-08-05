import { NavLink } from "react-router-dom";

const TeacherSidebar = ({ isOpen, onClose }) => {
    const linkClass = ({ isActive }) =>
        `block px-4 py-3 text-sm transition ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                className="bg-white border-r shadow-sm hidden lg:block flex-shrink-0"
                style={{ width: "260px", minHeight: "100vh" }}
            >
                <div className="p-4 border-b">
                    <h4 className="font-bold text-blue-600 text-lg">
                        Luma 2000
                    </h4>

                    <span className="text-xs text-gray-500">
                        Teacher Portal
                    </span>
                </div>

                <nav className="flex flex-col">

                    <NavLink
                        to="/teacher"
                        end
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-speedometer2 mr-2"></i>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/teacher/my-assignments"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-journal-bookmark-fill mr-2"></i>
                        Teaching Assignments
                    </NavLink>

                    <NavLink
                        to="/teacher/assessments"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-clipboard-data-fill mr-2"></i>
                        Assessments
                    </NavLink>

                    <NavLink
                        to="/teacher/attendance"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-calendar-check-fill mr-2"></i>
                        Attendance
                    </NavLink>

                    <NavLink
                        to="/teacher/timetable"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-calendar3 mr-2"></i>
                        Timetable
                    </NavLink>

                    <NavLink
                        className=""
                        to="/teacher/profile"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-person-circle mr-2"></i>
                        Profile
                    </NavLink>
                </nav>
            </aside>

            {/* Mobile slide-in sidebar */}
            <aside
                className={`bg-white border-r shadow-sm fixed top-0 left-0 h-full ${isOpen ? "block" : "hidden"} lg:hidden`}
                style={{
                    width: "280px",
                    zIndex: 1050,
                    transition: "transform 0.3s ease-in-out",
                    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                    overflowY: "auto",
                }}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-blue-600 text-lg mb-0">
                            Luma 2000
                        </h4>
                        <span className="text-xs text-gray-500">
                            Teacher Portal
                        </span>
                    </div>

                    <button
                        className="border border-gray-300 rounded px-2 py-1 text-sm hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <nav className="flex flex-col">

                    <NavLink
                        to="/teacher"
                        end
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-speedometer2 mr-2"></i>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/teacher/my-assignments"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-journal-bookmark-fill mr-2"></i>
                        Teaching Assignments
                    </NavLink>

                    <NavLink
                        to="/teacher/assessments"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-clipboard-data-fill mr-2"></i>
                        Assessments
                    </NavLink>

                    <NavLink
                        to="/teacher/attendance"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-calendar-check-fill mr-2"></i>
                        Attendance
                    </NavLink>

                    <NavLink
                        to="/teacher/timetable"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-calendar3 mr-2"></i>
                        Timetable
                    </NavLink>

                    <NavLink
                        to="/teacher/profile"
                        className={linkClass}
                        onClick={onClose}
                    >
                        <i className="bi bi-person-circle mr-2"></i>
                        Profile
                    </NavLink>
                </nav>
            </aside>
        </>
    );
};

export default TeacherSidebar;
