import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const CoordinatorClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [capacityData, setCapacityData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("No class ID found in URL");
      setLoading(false);
      return;
    }

    const loadClassDetails = async () => {
      try {
        // Load the selected class
        const classRes = await api.get(`classes/${id}/`);

        const selectedClass = classRes.data;

        setClassData(selectedClass);

        // Create the classroom display name
        const classroomName = `${selectedClass.grade}${
          selectedClass.stream ? ` ${selectedClass.stream}` : ""
        }`;

        // Load reports
        const [studentsRes, capacityRes, teachersRes] =
          await Promise.all([
            api.get("reports/students/by-class/"),
            api.get("reports/school/class-capacity/"),
            api.get("reports/teachers/by-class/"),
          ]);

        // -----------------------------------------
        // STUDENT REPORT
        // -----------------------------------------
        const studentsReport =
          studentsRes.data.results || studentsRes.data || [];

        const matchingStudents = studentsReport.find(
          (item) =>
            item.classroom?.toLowerCase() === classroomName.toLowerCase()
        );

        setStudentReport(matchingStudents || null);

        // -----------------------------------------
        // CAPACITY REPORT
        // -----------------------------------------
        const capacityReport =
          capacityRes.data.results || capacityRes.data || [];

        const matchingCapacity = capacityReport.find(
          (item) =>
            item.classroom?.toLowerCase() === classroomName.toLowerCase()
        );

        setCapacityData(matchingCapacity || null);

        // -----------------------------------------
        // TEACHER REPORT
        // -----------------------------------------
        const teacherReport =
          teachersRes.data.results || teachersRes.data || [];

        const matchingTeacher = teacherReport.find(
          (item) =>
            item.classroom?.toLowerCase() === classroomName.toLowerCase()
        );

        setTeacherData(matchingTeacher || null);
      } catch (err) {
        console.error("Failed to load class details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadClassDetails();
  }, [id]);

  // -----------------------------------------
  // LOADING
  // -----------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500">
          Loading class details...
        </p>
      </div>
    );
  }

  // -----------------------------------------
  // CLASS NOT FOUND
  // -----------------------------------------
  if (!classData) {
    return (
      <div className="card text-center py-10">
        <p className="text-red-500 text-lg">
          Class not found.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="milk-btn mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  // -----------------------------------------
  // VALUES
  // -----------------------------------------
  const classroomName = `${classData.grade}${
    classData.stream ? ` - ${classData.stream}` : ""
  }`;

  const totalStudents =
    studentReport?.total_students ??
    capacityData?.current_students ??
    0;

  const capacity =
    capacityData?.capacity ??
    classData.capacity ??
    0;

  const availableSpaces =
    capacityData?.available_spaces ??
    Math.max(capacity - totalStudents, 0);

  const classTeacher =
    teacherData?.class_teacher ||
    classData.class_teacher_name ||
    "Not Assigned";

  // -----------------------------------------
  // PAGE
  // -----------------------------------------
  return (
    <div className="space-y-8">

      {/* =========================================
          HEADER
      ========================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-gray-800">
            {classroomName}
          </h1>

          <p className="text-gray-500 mt-2">
            Class overview, students and capacity
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="milk-btn w-fit"
        >
          ← Back to Classes
        </button>
      </div>

      {/* =========================================
          CLASS OVERVIEW
      ========================================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Class Teacher */}
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">
            Class Teacher
          </p>

          <p className="stat-value text-lg mt-1">
            {classTeacher}
          </p>
        </div>

        {/* Total Students */}
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">
            Total Students
          </p>

          <p className="stat-value mt-1">
            {totalStudents}
          </p>
        </div>

        {/* Capacity */}
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">
            Class Capacity
          </p>

          <p className="stat-value mt-1">
            {capacity}
          </p>
        </div>

        {/* Available Spaces */}
        <div className="stat-card py-5">
          <p className="text-gray-700 font-medium">
            Available Spaces
          </p>

          <p className="stat-value mt-1">
            {availableSpaces}
          </p>
        </div>

      </div>

      {/* =========================================
          CLASS INFORMATION
      ========================================= */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Class Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <p className="text-sm text-gray-500">
              Grade
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {classData.grade || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Stream
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {classData.stream || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Class Teacher
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {classTeacher}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Maximum Capacity
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {capacity}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Current Students
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {totalStudents}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Available Spaces
            </p>

            <p
              className={`font-semibold mt-1 ${
                availableSpaces === 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {availableSpaces}
            </p>
          </div>

        </div>
      </div>

      {/* =========================================
          STUDENT SUMMARY
      ========================================= */}
      <div className="card">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Student Summary
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Current enrollment for {classroomName}
            </p>
          </div>
        </div>

        {!studentReport ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No student records found for this class.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-3 text-gray-600">
                    Class
                  </th>

                  <th className="py-3 px-3 text-gray-600">
                    Total Students
                  </th>

                  <th className="py-3 px-3 text-gray-600">
                    Capacity
                  </th>

                  <th className="py-3 px-3 text-gray-600">
                    Available Spaces
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-100 hover:bg-green-50">

                  <td className="py-4 px-3 font-medium text-gray-800">
                    {studentReport.classroom}
                  </td>

                  <td className="py-4 px-3">
                    {studentReport.total_students}
                  </td>

                  <td className="py-4 px-3">
                    {capacity}
                  </td>

                  <td
                    className={`py-4 px-3 font-semibold ${
                      availableSpaces === 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {availableSpaces}
                  </td>

                </tr>
              </tbody>

            </table>

          </div>
        )}
      </div>

      {/* =========================================
          CAPACITY STATUS
      ========================================= */}
      <div className="card">

        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Capacity Status
        </h2>

        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              Students
            </span>

            <span className="font-semibold text-gray-800">
              {totalStudents} / {capacity}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

            <div
              className={`h-3 rounded-full transition-all ${
                totalStudents >= capacity
                  ? "bg-red-500"
                  : totalStudents >= capacity * 0.8
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${
                  capacity > 0
                    ? Math.min(
                        (totalStudents / capacity) * 100,
                        100
                      )
                    : 0
                }%`,
              }}
            />

          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>
              {totalStudents} students enrolled
            </span>

            <span>
              {availableSpaces} spaces remaining
            </span>
          </div>

        </div>
      </div>

      {/* =========================================
          TEACHER INFORMATION
      ========================================= */}
      <div className="card">

        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Class Teacher
        </h2>

        <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">

          <div>
            <p className="text-sm text-gray-500">
              Assigned Teacher
            </p>

            <p className="font-semibold text-gray-800 text-lg mt-1">
              {classTeacher}
            </p>
          </div>

          {classData.class_teacher && (
            <div className="text-sm text-gray-500">
              Teacher ID: {classData.class_teacher}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default CoordinatorClassDetails;

