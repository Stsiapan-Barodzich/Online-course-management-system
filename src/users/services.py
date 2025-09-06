from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import User
from .serializers import UserSerializer

class AuthService:

    @staticmethod
    def register_user(request_data):
        serializer = UserSerializer(data=request_data)
        if not serializer.is_valid():
            return{
                "success": False,
                "errors": serializer.errors,
                "status": status.HTTP_400_BAD_REQUEST
            }
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return {
            "success": True,
            "data": {
                "message": "User registered",
                "user_id": user.id,
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            },
            "status": status.HTTP_201_CREATED
        }
    
    @staticmethod
    def login_user(username, password):
        user = authenticate(username=username, password=password)
        if user is None:
            return {
                "success": False,
                "error": "Invalid credentials",
                "status": status.HTTP_401_UNAUTHORIZED
            }
        
        refresh = RefreshToken.for_user(user)
        
        return {
            "success": True,
            "data": {
                "message": "User logged in",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "role": user.role
            },
            "status": status.HTTP_200_OK
        }

class UserService:
    @staticmethod
    def get_current_user(user):
        serializer = UserSerializer(user)
        return {
            "success": True,
            "data": serializer.data,
            "status": status.HTTP_200_OK
        }
        













