from .models import User

class UserSelector:
    
    @staticmethod
    def get_students():
        return User.objects.filter(role='STUDENT')
    
    @staticmethod
    def get_user_by_id(user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def get_user_by_username(username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None