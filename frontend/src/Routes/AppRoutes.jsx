import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import RoleRoute from './RoleRoute.jsx'; 

// Layout
import Layout from '@Components/SharedComponents/Layout/Layout.jsx';

// Auth
import Login from '@Components/AuthComponents/Login.jsx';
import Register from '@Components/AuthComponents/Register.jsx';
import Logout from '@Components/AuthComponents/Logout.jsx';

// Courses
import CourseList from '@Components/CourseComponents/CourseList.jsx';             
import CourseDetail from '@Components/CourseComponents/CourseDetail.jsx';        
import AddCourseForm from '@Components/CourseComponents/AddCourseForm.jsx';       
import EditCourseForm from '@Components/CourseComponents/EditCourseForm.jsx';     
import ManageCourseStudents from '@Components/CourseComponents/ManageCourseStudents.jsx'; 
import ManageCourseTeachers from '@Components/CourseComponents/ManageCourseTeachers.jsx'; 

// Lectures
import LectureList from '@Components/LectureComponents/LectureList.jsx';          
import LectureDetail from '@Components/LectureComponents/LectureDetail.jsx';      
import AddLectureForm from '@Components/LectureComponents/AddLectureForm.jsx';    
import EditLectureForm from '@Components/LectureComponents/EditLectureForm.jsx';  

// Homework
import AddHomeworkForm from '@Components/HomeworkComponents/AddHomeworkForm.jsx'; 
import EditHomeworkForm from '@Components/HomeworkComponents/EditHomeworkForm.jsx'; 

// Submissions
import SubmissionList from '@Components/SubmissionComponents/SubmissionList.jsx'; 
import AddSubmissionForm from '@Components/SubmissionComponents/AddSubmissionForm.jsx'; 

// Grades
import GradeList from '@Components/GradeComponents/GradeList.jsx';              
import GradeForm from '@Components/GradeComponents/AddGradeForm.jsx';                
            

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
