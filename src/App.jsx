import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoutes from "./components/context/ProtectedRoutes";

import Login from "./components/Login";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Unauthorized from "./components/Unauthorized";

/* ================= ADMIN ================= */
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import Users from "./components/admin/Users";
import Teachers from "./components/admin/Teachers";
import Parents from "./components/admin/Parents";
import Classes from "./components/admin/Classes";
import ClassForm from "./components/admin/ClassForm";
import AdminSubjects from "./components/admin/AdminSubjects";
import SubjectForm from "./components/admin/SubjectForm";
import Assignments from "./components/admin/Assignments";
import AssignmentForm from "./components/admin/AssignmentForm";
import Announcements from "./components/admin/Announcements";
import AnnouncementForm from "./components/admin/AnnouncementForm";
import Fees from "./components/admin/Fees";
import FeeForm from "./components/admin/FeeForm";
import Payments from "./components/admin/Payments";
import Reports from "./components/admin/Reports";
import AdminProfile from "./components/admin/AdminProfile";

/* ================= ACADEMIC COORDINATOR ================= */
import AcademicCoLayout from "./components/academiccoordinator/AcademicCoLayout";
import AcademicCoDashboard from "./components/academiccoordinator/AcademicCoDashboard";
import Assessments from "./components/academiccoordinator/Assessments";
import Timetable from "./components/academiccoordinator/TimeTable";
import StudentResults from "./components/academiccoordinator/StudentResults";
import GradeScales from "./components/academiccoordinator/GradeScales";
import ReportComments from "./components/academiccoordinator/ReportComments";

/* ================= ACCOUNTANT ================= */
import AccountantLayout from "./components/accountant/AccountantLayout";
import AccountantDashboard from "./components/accountant/AccountantDashboard";
import AccountantNotice from "./components/accountant/AccountantNotices";
import FeeStructures from "./components/accountant/FeeStrutures";
import StudentFees from "./components/accountant/StudentFees";
import FeePayments from "./components/accountant/FeePayment";
import FinanceReport from "./components/accountant/FinaceReport";
import AccountantProfile from "./components/accountant/AccountantProfile";

/* ================= PARENT ================= */
import ParentDashboard from "./components/parents/ParentDashboard";
import MyChildren from "./components/parents/MyChildren";
import ParentAttendance from "./components/parents/ParentAttendance";
import ParentResults from "./components/parents/ParentsResults";
import ParentFees from "./components/parents/ParentFees";
import ParentPayments from "./components/parents/ParentPayment";
import ParentNotifications from "./components/parents/ParentNotifications";
import ParentProfile from "./components/parents/ParentProfile";

/* ================= TEACHER ================= */
import TeacherRoute from "./components/teachers/TeacherRoutes";
import TeacherLayout from "./components/teachers/TeacherLayout";
import TeacherDashboard from "./components/teachers/TeacherDashboard";
import TeachingAssignments from "./components/teachers/TeachingAssignments";
import AssignmentDetails from "./components/teachers/AssignmentDetails";
import TeacherAssessments from "./components/teachers/TeacherAssessments";
import AssessmentsMarksEntry from "./components/teachers/AssessmentsMarksEntry";
import MarkAttendance from "./components/teachers/MarkAttendance";
import TeacherStudents from "./components/teachers/TeacherStudent";
import TeacherStudentDetails from "./components/teachers/TeacherStudentDetails";
import TeacherTimetable from "./components/teachers/TeacherTimetable";
import TeacherProfile from "./components/teachers/TeacherProfile";
import AdminTimetables from "./components/admin/AdminTimetable";
import AdminTimetableForm from "./components/academiccoordinator/TimetableForm";
import RegisterUsers from "./components/admin/RegisterUsers";
import RegisterStudents from "./components/admin/RegisterStudents";
import AdminStudents from "./components/admin/AdminStudents";
import StudentsAcademic from "./components/academiccoordinator/StudentsAcademic";
import SubjectsAcademic from "./components/academiccoordinator/SubjectsAcademic";
import ResultsSubmissions from "./components/academiccoordinator/ResultsSubmission";
import LearningOutcomes from "./components/academiccoordinator/LearnigOutcomes";
import AcademicCoProfile from "./components/academiccoordinator/AademicCoProfile";
import TimetableForm from "./components/academiccoordinator/TimetableForm";
import ParentLayout from "./components/parents/ParentLayout";
import ParentSettings from "./components/parents/ParentSettings";
import ParentReportCard from "./components/parents/ParentReportCard";
import ParentPayment from "./components/parents/ParentPayment";
import ChildDetail from "./components/parents/ChildDetails";

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* Global Protected Routes Wrapper */}
        <Route element={<ProtectedRoutes />}>

          {/* ================= ADMIN ================= */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="register-user" element={<RegisterUsers />} />
            <Route path="register-student" element={<RegisterStudents />} />
            <Route path="users" element={<Users />} />
            <Route path="users/edit/:id" element={<RegisterUsers />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="parents" element={<Parents />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="classes" element={<Classes />} />
            <Route path="classes/create" element={<ClassForm />} />
            <Route path="classes/edit/:id" element={<ClassForm />} />
            <Route path="subjects" element={<AdminSubjects />} />
            <Route path="subjects/create" element={<SubjectForm />} />
            <Route path="subjects/edit/:id" element={<SubjectForm />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="assignments/create" element={<AssignmentForm />} />
            <Route path="assignments/edit/:id" element={<AssignmentForm />} />
            <Route path="timetable" element={<AdminTimetables />} />
            <Route path="timetable/create" element={<AdminTimetableForm />} />
            <Route path="timetable/edit/:id" element={<AdminTimetableForm />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="announcements/create" element={<AnnouncementForm />} />
            <Route path="announcements/edit/:id" element={<AnnouncementForm />} />
            <Route path="fees" element={<Fees />} />
            <Route path="fees/create" element={<FeeForm />} />
            <Route path="fees/edit/:id" element={<FeeForm />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* ================= ACADEMIC COORDINATOR ================= */}
          <Route path="/academic-coordinator" element={<AcademicCoLayout />}>
            <Route index element={<AcademicCoDashboard />} />
            <Route path="students" element={<StudentsAcademic />} />
            <Route path="subjects" element={<SubjectsAcademic />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="timetable/create" element={<TimetableForm />} />
            <Route path="result-submissions" element={<ResultsSubmissions />} />
            <Route path="student-results" element={<StudentResults />} />
            <Route path="grade-scales" element={<GradeScales />} />
            <Route path="report-comments" element={<ReportComments />} />
            <Route path="learning-outcomes" element={<LearningOutcomes />} />
            <Route path="profile" element={<AcademicCoProfile />} />
          </Route>

          {/* ================= ACCOUNTANT ================= */}
          <Route path="/accountant" element={<AccountantLayout />}>
            <Route index element={<AccountantDashboard />} />
            <Route path="students" element={<StudentsAcademic />} />
            <Route path="notices" element={<AccountantNotice />} />
            <Route path="fee-structures" element={<FeeStructures />} />
            <Route path="student-fees" element={<StudentFees />} />
            <Route path="fee-payments" element={<FeePayments />} />
            <Route path="reports" element={<FinanceReport />} />
            <Route path="profile" element={<AccountantProfile />} />
          </Route>

{/* ================= PARENT (Fixed & Protected) ================= */}
          <Route
            path="/parent-dashboard"
            element={
              <ProtectedRoutes allowedRoles={["parent"]}>
                <ParentLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<ParentDashboard />} />
            <Route path="my-children" element={<MyChildren />} />
            <Route path="my-children/:studentId" element={<ChildDetail />} />
            <Route path="attendance" element={<ParentAttendance />} />
            <Route path="results" element={<ParentResults />} />
            <Route path="fees" element={<ParentFees />} />
            <Route path="payments" element={<ParentPayments />} />
            <Route path="pay/new/:studentId" element={<ParentPayment />} />
            <Route path="report-cards" element={<ParentReportCard />} />
            <Route path="notifications" element={<ParentNotifications />} />
            <Route path="settings" element={<ParentSettings />} />
            <Route path="profile" element={<ParentProfile />} />
          </Route>

          {/* ================= TEACHER ================= */}
          <Route element={<TeacherRoute />}>
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="my-assignments" element={<TeachingAssignments />} />
              <Route path="assignments/:id" element={<AssignmentDetails />} />
              <Route path="assessments" element={<TeacherAssessments />} />
              <Route path="assessments/:id" element={<AssessmentsMarksEntry />} />
              <Route path="attendance" element={<MarkAttendance />} />
              <Route path="attendance/:id" element={<MarkAttendance />} />
              <Route path="students" element={<TeacherStudents />} />
              <Route path="students/:id" element={<TeacherStudentDetails />} />
              <Route path="timetable" element={<TeacherTimetable />} />
              <Route path="profile" element={<TeacherProfile />} />
            </Route>
          </Route>

          {/* Optional General Redirect */}
          <Route path="/dashboard" element={<Navigate to="/parent" replace />} />
        </Route>

        {/* ERROR PAGES */}
        <Route path="/not_authorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;