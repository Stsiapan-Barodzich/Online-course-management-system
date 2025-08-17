from rest_framework import viewsets, permissions
from .models import Course
from .serializers import CourseSerializer
from users.models import User

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.all()  # Добавляем начальный queryset

    def get_queryset(self):
        user = self.request.user
        if user.is_teacher():
            return Course.objects.filter(teacher=user)
        elif user.is_student():
            return Course.objects.filter(students=user)
        return Course.objects.none()

    def perform_create(self, serializer):
        serializer.save()