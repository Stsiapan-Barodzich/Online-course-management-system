# users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer
from .services import AuthService, UserService
from .selectors import UserSelector


class RegisterView(APIView):
    def post(self, request):
        result = AuthService.register_user(request.data)
        
        if result["success"]:
            return Response(result["data"], status=result["status"])
        else:
            return Response(result["errors"], status=result["status"])


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        result = AuthService.login_user(username, password)
        
        if result["success"]:
            return Response(result["data"], status=result["status"])
        else:
            return Response({"error": result["error"]}, status=result["status"])


class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserSelector.get_students()


class UserMeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        result = UserService.get_current_user(request.user)
        return Response(result["data"], status=result["status"])