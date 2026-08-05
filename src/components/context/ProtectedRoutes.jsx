import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoutes = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated } = useContext(AuthContext);

    // Not logged in at all → go to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role → go to access denied
    const userRole = (user.role || "").toLowerCase();
    if (allowedRoles.length > 0 && !allowedRoles.some((r) => r.toLowerCase() === userRole)) {
        return <Navigate to="/not_authorized" replace />;
    }

    // All good → show content
    return children ?? <Outlet />;
};

export default ProtectedRoutes;