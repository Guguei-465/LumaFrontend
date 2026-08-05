import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
    users: 0,
    classes: 0,
    subjects: 0,
    announcements: 0,
    feeStructures: 0,
  });

  const [recentStudents, setRecentStudents] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [
        students,
        teachers,
        parents,
        users,
        classes,
        subjects,
        announcements,
        fees,
      ] = await Promise.all([
        api.get("students/"),
        api.get("teachers/"),
        api.get("accounts/parents/"),
        api.get("accounts/users/"),
        api.get("classes/"),
        api.get("subjects/"),
        api.get("announcements/"),
        api.get("fees/"),
      ]);

      setStats({
        students: students.data.length,
        teachers: teachers.data.length,
        parents: parents.data.length,
        users: users.data.length,
        classes: classes.data.length,
        subjects: subjects.data.length,
        announcements: announcements.data.length,
        feeStructures: fees.data.length,
      });

      setRecentStudents(students.data.slice());
      setRecentAnnouncements(announcements.data.slice());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Students",
      className: "card p-8 m-4",
      value: stats.students,
      link: "admin/students",
    },
    {
      title: "Teachers",
      value: stats.teachers,
      link: "admin/teachers",
    },
    {
      title: "Parents",
      value: stats.parents,
      link: "admin/parents",
    },
    {
      title: "Users",
      value: stats.users,
      link: "admin/users",
    },
    {
      title: "Classes",
      value: stats.classes,
      link: "admin/classes",
    },
    {
      title: "Subjects",
      value: stats.subjects,
      link: "admin/subjects",
    },
    {
      title: "Announcements",
      value: stats.announcements,
      className: "card",
      link: "admin/announcements",
    },
    {
      title: "Fee Structures",
      className: "card",
      value: stats.feeStructures,
      link: "admin/fees",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="h-full m-4 bg-gray-100 ">
      <div className="p-5">

      

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="card p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition"
          >
            <div className="flex mx-4 justify-between items-center">

              <div>

                <h3 className="text-lg">
                  {card.title}
                </h3>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>

              </div>


            </div>

          </Link>
        ))}

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-xl font-bold mt-4 mb-5">
            Recently Registered Students
          </h2>

          <div className="space-y-4">

            {recentStudents.length > 0 ? (
              recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <h4 className="font-semibold">
                      {student.first_name} {student.last_name}
                    </h4>

                    <p className="text-gray-500 text-sm">
                      {student.admission_number}
                    </p>
                  </div>

                  <Link
                    to={`/admin/students/${student.id}`}
                    className="text-green-600 hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <p>No students found.</p>
            )}

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-xl font-bold mb-5">
            Latest Announcements
          </h2>

          <div className="space-y-4">

            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="border-b pb-3"
                >
                  <h4 className="font-semibold">
                    {item.title}
                  </h4>

                  <p className="text-gray-500 text-sm">
                    {item.target}
                  </p>
                </div>
              ))
            ) : (
              <p>No announcements available.</p>
            )}

          </div>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-8">

        <h2 className="text-xl font-bold mb-5">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <Link
            to="/admin/register-user"
            className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
          >
            Register User
          </Link>

          <Link
            to="/admin/register-student"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            Register Student
          </Link>

          <Link
            to="/admin/announcements"
            className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700"
          >
            Post Announcement
          </Link>

          <Link
            to="/admin/fees"
            className="bg-orange-600 text-white px-5 py-3 rounded-lg hover:bg-orange-700"
          >
            Manage Fees
          </Link>

        </div>

      </div>
      </div>

    </div>
  );
};

export default AdminDashboard;