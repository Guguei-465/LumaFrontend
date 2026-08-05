import { useEffect, useState } from "react";
import api from "../api/api";

const TeacherTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTimetable = async () => {
        try {
            setLoading(true);

            const { data } = await api.get(
                "/timetable/my-timetable/"
            );

            setTimetable(
                data.sort(
                    (a, b) =>
                        a.start_time.localeCompare(b.start_time)
                )
            );

        } catch (err) {
            console.error(err);
            setError("Failed to load timetable.");
        } finally {
            setLoading(false);
        }
    }; 

    useEffect(() => {
        fetchTimetable();
    }, []);

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const groupedTimetable = days.map(day => ({
        day,
        lessons: timetable.filter(
            lesson => lesson.day === day
        ),
    }));

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="px-4 py-4">

            <div className="bg-white rounded-xl shadow">

                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-bold">
                        My Timetable
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    {groupedTimetable.map(({ day, lessons }) => (
                        <div key={day}>
                            <h3 className="text-base font-semibold mb-3 text-blue-700">
                                {day}
                            </h3>
                            {lessons.length === 0 ? (
                                <div className="text-gray-500 italic text-sm">
                                    No lessons scheduled.
                                </div>
                            ) : (
                                <>
                                    {/* Desktop table */}
                                    <div className="overflow-x-auto rounded-lg border hidden md:block">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Time
                                                    </th>
                                                    <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Subject
                                                    </th>
                                                    <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Class
                                                    </th>
                                                    <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Academic Year
                                                    </th>
                                                    <th className="border-b px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Term
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-gray-200">
                                                {lessons.map((lesson) => (
                                                    <tr key={lesson.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {lesson.start_time} - {lesson.end_time}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {lesson.subject}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {lesson.classroom}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {lesson.academic_year}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {lesson.term}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile cards */}
                                    <div className="md:hidden space-y-3">
                                        {lessons.map((lesson) => (
                                            <div key={lesson.id} className="bg-gray-50 rounded-lg p-3 border">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold text-sm text-blue-700">
                                                        {lesson.subject}
                                                    </span>
                                                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                                        {lesson.start_time} - {lesson.end_time}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Class:</span> {lesson.classroom}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Year:</span> {lesson.academic_year}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Term:</span> {lesson.term}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherTimetable;

