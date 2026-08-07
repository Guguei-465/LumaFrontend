# AcademicCoordinator Component Fixes

- [x] Fix missing react-icons imports in `Assessments.jsx`
- [x] Add missing `AcademicCoLayout` import in `App.jsx`
- [x] Create missing `StudentsAcademic.jsx` component referenced by `App.jsx`
- [x] Run build to verify errors are resolved

# 401 Unauthorized Fixes

- [x] Normalize roles in `ProtectedRoutes.jsx` (underscore/hyphen mismatch: `ACADEMIC_COORDINATOR` vs `academic-coordinator`)
- [x] Implement refresh-token flow in `api.js` to automatically retry with a fresh token before logging out on 401
- [x] Verified build succeeds

# Sidebar 404 Fixes

- [x] Create `ResultSubmissions.jsx` and wire up `/academic-coordinator/result-submissions`
- [x] Create `StudentResults.jsx` and wire up `/academic-coordinator/student-results`
- [x] Create `ReportComments.jsx` and wire up `/academic-coordinator/report-comments`
- [x] Verified build succeeds

