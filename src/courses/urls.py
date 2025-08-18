from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, LectureViewSet, HomeworkViewSet, SubmissionViewSet, GradeViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'lectures', LectureViewSet)
router.register(r'homework', HomeworkViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'grades', GradeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]