import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const TeacherRoute = () => {

    const { user, loading } = useContext(AuthContext);

    if (loading) {

        return (
            <div className="text-center mt-5">
                Loading...
            </div>
        );

    }
    if (!user) {

        return <Navigate to="/login" replace />;

    }

    if (user.role !== "TEACHER") {

        return <Navigate to="/401" replace />;

    }

    return <Outlet />;

};

export default TeacherRoute;