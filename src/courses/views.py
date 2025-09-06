from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Course, Lecture, Homework, Submission, Grade
from .serializers import CourseSerializer, LectureSerializer, HomeworkSerializer, SubmissionSerializer, GradeSerializer
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404

from .services import CourseService, LectureService, HomeworkService, SubmissionService, GradeService
from .selectors import CourseSelector, LectureSelector, HomeworkSelector, SubmissionSelector, GradeSelector


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.all()
    def get_queryset(self):
        return CourseSelector.get_courses_for_user(self.request.user)

    def perform_create(self, serializer):
        CourseService.create_course(serializer, self.request.user)

    def perform_update(self, serializer):
        course = self.get_object()
        CourseService.update_course(course, serializer, self.request.user)

    def perform_destroy(self, instance):
        CourseService.delete_course(instance, self.request.user)

    @action(detail=True, methods=['get'], url_path='students')
    def students_list(self, request, pk=None):
        course = self.get_object()
        students = CourseSelector.get_course_students(course)
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='add-student')
    def add_student(self, request, pk=None):
        course = self.get_object()
        student_id = request.data.get("student_id")
        
        result = CourseService.add_student_to_course(course, student_id, request.user)
        
        if result['success']:
            return Response({"detail": result['detail']})
        else:
            return Response({"detail": result['detail']}, status=result['status'])

    @action(detail=True, methods=['post'], url_path='remove-student')
    def remove_student(self, request, pk=None):
        course = self.get_object()
        student_id = request.data.get("student_id")
        
        result = CourseService.remove_student_from_course(course, student_id, request.user)
        
        if result['success']:
            return Response({"detail": result['detail']})
        else:
            return Response({"detail": result['detail']}, status=result['status'])
        
    @action(detail=True, methods=['get'], url_path='lectures')
    def course_lectures(self, request, pk=None):
        course = self.get_object()
        lectures = LectureSelector.get_lectures_for_user_and_course(request.user, course)
        serializer = LectureSerializer(lectures, many=True)
        return Response(serializer.data)


class LectureViewSet(viewsets.ModelViewSet):
    serializer_class = LectureSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Lecture.objects.all()

    def get_queryset(self):
        if self.request.user.is_teacher():
            return Lecture.objects.filter(course__teacher=self.request.user)
        elif self.request.user.is_student():
            return Lecture.objects.filter(course__students=self.request.user)
        return Lecture.objects.none()

    def perform_create(self, serializer):
        if not self.request.user.is_teacher():
            raise permissions.PermissionDenied("Only teachers can create lectures")
        serializer.save()


class HomeworkViewSet(viewsets.ModelViewSet):
    serializer_class = HomeworkSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Homework.objects.all()

    def get_queryset(self):
        filters = {
            "lecture": self.request.GET.get("lecture")
        }
        return HomeworkSelector.get_homework_for_user(self.request.user, filters)

    def perform_create(self, serializer):
        lecture_id = self.kwargs.get("lecture_pk") or self.kwargs.get("lecture_id")
        HomeworkService.create_homework(serializer, self.request.user, lecture_id)


class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Submission.objects.all()

    def get_queryset(self):
        lecture_id = self.request.GET.get("lecture")
        homework_id = self.request.GET.get("homework")
        return SubmissionSelector.get_submissions_for_user(self.request.user, lecture_id, homework_id)

    def perform_create(self, serializer):
        SubmissionService.create_submission(serializer, self.request.user)


class GradeViewSet(viewsets.ModelViewSet):
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Grade.objects.all()

    def get_queryset(self):
        return GradeSelector.get_grades_for_user(self.request.user)

    def perform_create(self, serializer):
        GradeService.create_grade(serializer, self.request.user)