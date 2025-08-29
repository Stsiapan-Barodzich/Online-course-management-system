from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Course, Lecture, Homework, Submission, Grade
from .serializers import CourseSerializer, LectureSerializer, HomeworkSerializer, SubmissionSerializer, GradeSerializer
from users.models import User
from .serializers import UserSerializer

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.is_teacher():
            return Course.objects.filter(teacher=user)
        elif user.is_student():
            return Course.objects.filter(students=user)
        return Course.objects.none()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    def perform_update(self, serializer):
        course = self.get_object()
        if self.request.user != course.teacher:
            raise permissions.PermissionDenied("You are not the teacher of this course")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.teacher:
            raise permissions.PermissionDenied("You are not the teacher of this course")
        instance.delete()


    @action(detail=True, methods=['get'], url_path='students')
    def students_list(self, request, pk=None):
        course = self.get_object()
        students = course.students.all()
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='add-student')
    def add_student(self, request, pk=None):
        course = self.get_object()
        if request.user != course.teacher:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        student_id = request.data.get("student_id")
        if not student_id:
            return Response({"detail": "Student ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            student = User.objects.get(id=student_id, role='STUDENT')
            if student in course.students.all():
                return Response({"detail": "Student already enrolled"}, status=status.HTTP_400_BAD_REQUEST)
            course.students.add(student)
            return Response({"detail": f"Student {student.username} added"})
        except User.DoesNotExist:
            return Response({"detail": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='remove-student')
    def remove_student(self, request, pk=None):
        course = self.get_object()
        if request.user != course.teacher:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        student_id = request.data.get("student_id")
        if not student_id:
            return Response({"detail": "Student ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            student = User.objects.get(id=student_id, role='STUDENT')
            if student not in course.students.all():
                return Response({"detail": "Student not enrolled"}, status=status.HTTP_400_BAD_REQUEST)
            course.students.remove(student)
            return Response({"detail": f"Student {student.username} removed"})
        except User.DoesNotExist:
            return Response({"detail": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

# Дополнительные ViewSet для других моделей
class LectureViewSet(viewsets.ModelViewSet):
    serializer_class = LectureSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Lecture.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.is_teacher():
            return Lecture.objects.filter(course__teacher=user)
        elif user.is_student():
            return Lecture.objects.filter(course__students=user)
        return Lecture.objects.none()

    def perform_create(self, serializer):
        if not self.request.user.is_teacher():
            raise permissions.PermissionDenied("Only teachers can create lectures")
        serializer.save()

class HomeworkViewSet(viewsets.ModelViewSet):
    serializer_class = HomeworkSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Homework.objects.all()   # ✅ добавили базовый queryset

    def get_queryset(self):
        user = self.request.user
        qs = Homework.objects.all()

        # фильтруем по роли
        if user.is_teacher():
            qs = qs.filter(lecture__course__teacher=user)
        elif user.is_student():
            qs = qs.filter(lecture__course__students=user)
        else:
            return Homework.objects.none()

        # фильтруем по lecture query param
        lecture_id = self.request.GET.get("lecture")
        if lecture_id:
            qs = qs.filter(lecture_id=lecture_id)

        return qs

    def perform_create(self, serializer):
        if not self.request.user.is_teacher():
            raise permissions.PermissionDenied("Only teachers can create homework")

        lecture_id = self.kwargs.get("lecture_pk") or self.kwargs.get("lecture_id")
        if lecture_id:
            serializer.save(lecture_id=lecture_id)
        else:
            serializer.save()

class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Submission.objects.all()

    def get_queryset(self):
        user = self.request.user
        qs = Submission.objects.all()

        if user.is_student():
            qs = qs.filter(student=user)
        elif user.is_teacher():
            qs = qs.filter(homework__lecture__course__teacher=user)
        else:
            return Submission.objects.none()

        # фильтрация по lecture
        lecture_id = self.request.GET.get("lecture")
        if lecture_id:
            qs = qs.filter(homework__lecture_id=lecture_id)

        # фильтрация по homework
        homework_id = self.request.GET.get("homework")
        if homework_id:
            qs = qs.filter(homework_id=homework_id)

        return qs

    def perform_create(self, serializer):
        if not self.request.user.is_student():
            raise permissions.PermissionDenied("Only students can submit homework")
        serializer.save(student=self.request.user)

class GradeViewSet(viewsets.ModelViewSet):

    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Grade.objects.all()

    def create(self, request, *args, **kwargs):
        print("=== GRADE CREATE REQUEST ===")
        print("User:", request.user)
        print("User role:", request.user.role)
        print("Request data:", request.data)
        print("Request content type:", request.content_type)
        try:
            response = super().create(request, *args, **kwargs)
            print("Response status:", response.status_code)
            print("Response data:", response.data)
            return response
        except Exception as e:
            print("ERROR:", str(e))
            print("Error type:", type(e))
            import traceback
            traceback.print_exc()
            raise
    def get_queryset(self):
        user = self.request.user
        if user.is_teacher():
            return Grade.objects.filter(teacher=user)
        elif user.is_student():
            return Grade.objects.filter(submission__student=user)
        return Grade.objects.none()

    def perform_create(self, serializer):
        if not self.request.user.is_teacher():
            raise permissions.PermissionDenied("Only teachers can grade")
        serializer.save(teacher=self.request.user)