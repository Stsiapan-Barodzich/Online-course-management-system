from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Course, Lecture, Homework, Submission, Grade
from .serializers import CourseSerializer, LectureSerializer, HomeworkSerializer, SubmissionSerializer, GradeSerializer
from users.models import User
from .serializers import UserSerializer


class CourseSelector:

    @staticmethod
    def get_courses_for_user(user):
        if user.is_teacher():
            return Course.objects.filter(teacher=user)
        elif user.is_student():
            return Course.objects.filter(students=user)
        return Course.objects.none()
    
    @staticmethod
    def get_course_students(course):
        return course.students.all()
    
    
class LectureSelector:

    @staticmethod
    def get_lectures_for_user_and_course(user, course):
        """Лекции конкретного курса, доступные пользователю"""
        if user.is_teacher() and course.teacher == user:
            return Lecture.objects.filter(course=course)
        elif user.is_student() and user in course.students.all():
            return Lecture.objects.filter(course=course)
        return Lecture.objects.none()
    
class HomeworkSelector:
    @staticmethod
    def get_homework_for_user(user, filters=None):
        if user.is_teacher():
            qs = Homework.objects.filter(lecture__course__teacher=user)
        elif user.is_student():
            qs = Homework.objects.filter(lecture__course__students=user)
        else:
            return Homework.objects.none()

        if filters:
            lecture_id = filters.get("lecture")
            if lecture_id:
                qs = qs.filter(lecture_id=lecture_id)

        return qs

class SubmissionSelector:
    
    @staticmethod
    def get_submissions_for_user(user, lecture_id=None, homework_id=None):
        queryset = Submission.objects.all()

        if user.is_student():
           queryset = queryset.filter(student=user)
        elif user.is_teacher():
            queryset = queryset.filter(homework__lecture__course__teacher=user)
        else:
            return Submission.objects.none()

        if lecture_id:
            queryset = queryset.filter(homework__lecture_id=lecture_id)

        if homework_id:
            queryset = queryset.filter(homework_id=homework_id)

        return queryset
    
    
class GradeSelector:
    
    @staticmethod
    def get_grades_for_user(user):
        if user.is_teacher():
            return Grade.objects.filter(teacher=user)
        elif user.is_student():
            return Grade.objects.filter(submission__student=user)
        return Grade.objects.none()

