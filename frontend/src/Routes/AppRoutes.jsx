import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import RoleRoute from './RoleRoute.jsx'; // см. ниже, если ещё нет – добавь

// Layout
import Layout from '@Components/SharedComponents/Layout/Layout.jsx';

// Auth
import Login from '@Components/AuthComponents/Login.jsx';
import Register from '@Components/AuthComponents/Register.jsx';
import Logout from '@Components/AuthComponents/Logout.jsx';

// Courses
import CourseList from '@Components/CourseComponents/CourseList.jsx';             // список доступных пользователю курсов
import CourseDetail from '@Components/CourseComponents/CourseDetail.jsx';         // инфо по курсу (лекции, состав)
import AddCourseForm from '@Components/CourseComponents/AddCourseForm.jsx';       // teacher-only
import EditCourseForm from '@Components/CourseComponents/EditCourseForm.jsx';     // teacher-only
import ManageCourseStudents from '@Components/CourseComponents/ManageCourseStudents.jsx'; // add/remove student (teacher-only)
import ManageCourseTeachers from '@Components/CourseComponents/ManageCourseTeachers.jsx'; // add co-teacher (teacher-only)

// Lectures
import LectureList from '@Components/LectureComponents/LectureList.jsx';          // список лекций курса
import LectureDetail from '@Components/LectureComponents/LectureDetail.jsx';      // детали лекции
import AddLectureForm from '@Components/LectureComponents/AddLectureForm.jsx';    // teacher-only
import EditLectureForm from '@Components/LectureComponents/EditLectureForm.jsx';  // teacher-only

// Homework
import AddHomeworkForm from '@Components/HomeworkComponents/AddHomeworkForm.jsx'; // teacher-only
import EditHomeworkForm from '@Components/HomeworkComponents/EditHomeworkForm.jsx'; // teacher-only

// Submissions
import SubmissionList from '@Components/SubmissionComponents/SubmissionList.jsx'; // teacher видит отправленные по лекции/домашке
import AddSubmissionForm from '@Components/SubmissionComponents/AddSubmissionForm.jsx'; // student-only (отправка)

// Grades
import GradeList from '@Components/GradeComponents/GradeList.jsx';                // teacher-only по лекции/курсу
import GradeForm from '@Components/GradeComponents/AddGradeForm.jsx';                // teacher-only создать/обновить оценку
import MyGrades from '@Components/GradeComponents/MyGrades.jsx';                  // student-only

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login/" replace />} />
      <Route path="/login/" element={<Login />} />
      <Route path="/register/" element={<Register />} />
      <Route path="/logout/" element={<Logout />} />

      {/* Protected */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>

          {/* Общие для авторизованных (и студент, и преподаватель) */}
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />

          <Route path="/courses/:courseId/lectures" element={<LectureList />} />
          <Route path="/courses/:courseId/lectures/:lectureId" element={<LectureDetail />} />


          {/* Student-only */}
          <Route element={<RoleRoute allowed={['STUDENT']} />}>
            <Route path="/courses/:courseId/lectures/:lectureId/submit" element={<AddSubmissionForm />} />
            <Route path="/my/grades" element={<MyGrades />} />
          </Route>

          {/* Teacher-only */}
          <Route element={<RoleRoute allowed={['TEACHER']} />}>
            {/* Курсы */}
            <Route path="/courses/add" element={<AddCourseForm />} />
            <Route path="/courses/:courseId/edit" element={<EditCourseForm />} />
            <Route path="/courses/:courseId/students" element={<ManageCourseStudents />} />
            <Route path="/courses/:courseId/teachers" element={<ManageCourseTeachers />} />

            {/* Лекции */}
            <Route path="/courses/:courseId/lectures/add" element={<AddLectureForm />} />
            <Route path="/courses/:courseId/lectures/:lectureId/edit" element={<EditLectureForm />} />

            {/* Домашки */}
            <Route path="/courses/:courseId/lectures/:lectureId/homework/add" element={<AddHomeworkForm />} />
            <Route path="/courses/:courseId/lectures/:lectureId/homework/:homeworkId/edit" element={<EditHomeworkForm />} />

            {/* Отправки и оценки (по лекции/домашке) */}
            <Route path="/courses/:courseId/lectures/:lectureId/submissions" element={<SubmissionList />} />
            <Route path="/courses/:courseId/lectures/:lectureId/grades" element={<GradeList />} />
            <Route path="/grades/:submissionId/edit" element={<GradeForm />} />
          </Route>

        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/courses" replace />} />
    </Routes>
  );
}

export default AppRoutes;
