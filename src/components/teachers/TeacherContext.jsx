import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api";


const TeacherContext = createContext();

export const useTeacher = () => {
    const context = useContext(TeacherContext);
    if (!context) {
        throw new Error("useTeacher must be used within a TeacherProvider");
    }
    return context;
};

export const TeacherProvider = ({ children }) => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/dashboard/teacher/");
            setDashboard(response.data);
        } catch (err) {
            console.error("Failed to fetch teacher dashboard:", err);
            setError("Unable to load teacher dashboard.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const contextValue = useMemo(
        () => ({
            dashboard,
            loading,
            error,
            refetch: fetchDashboard,
        }),
        [dashboard, loading, error, fetchDashboard]
    );

    return (
        <TeacherContext.Provider value={contextValue}>
            {children}
        </TeacherContext.Provider>
    );
};

export default TeacherContext;

