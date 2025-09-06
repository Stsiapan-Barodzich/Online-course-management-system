from django.core.exceptions import PermissionDenied
from rest_framework import status
from users.models import User


class CourseService:
    
    @staticmethod
    def create_course(serializer, user):
        return serializer.save(teacher=user)
    
    @staticmethod
    def update_course(instance, serializer, user):
        if user != instance.teacher:
            raise PermissionDenied("You are not the teacher of this course")
        return serializer.save()
    
    @staticmethod
    def delete_course(instance, user):
        if user != instance.teacher:
            raise PermissionDenied("You are not the teacher of this course")
        instance.delete()
    
    @staticmethod
    def get_course_students(course):
        return course.students.all()
    
    @staticmethod
    def add_student_to_course(course, student_id, requesting_user):
        if requesting_user != course.teacher:
            return {
                "success": False,
                "detail": "Not allowed",
                "status": status.HTTP_403_FORBIDDEN
            }
        
        if not student_id:
            return {
                "success": False,
                "detail": "Student ID is required",
                "status": status.HTTP_400_BAD_REQUEST
            }
        
        try:
            student = User.objects.get(id=student_id, role='STUDENT')
            if student in course.students.all():
                return {
                    "success": False,
                    "detail": "Student already enrolled",
                    "status": status.HTTP_400_BAD_REQUEST
                }
            
            course.students.add(student)
            return {
                "success": True,
                "detail": f"Student {student.username} added",
                "status": status.HTTP_200_OK
            }
            
        except User.DoesNotExist:
            return {
                "success": False,
                "detail": "Student not found",
                "status": status.HTTP_404_NOT_FOUND
            }
    
    @staticmethod
    def remove_student_from_course(course, student_id, requesting_user):
        if requesting_user != course.teacher:
            return {
                "success": False,
                "detail": "Not allowed",
                "status": status.HTTP_403_FORBIDDEN
            }
        
        if not student_id:
            return {
                "success": False,
                "detail": "Student ID is required",
                "status": status.HTTP_400_BAD_REQUEST
            }
        
        try:
            student = User.objects.get(id=student_id, role='STUDENT')
            if student not in course.students.all():
                return {
                    "success": False,
                    "detail": "Student not enrolled",
                    "status": status.HTTP_400_BAD_REQUEST
                }
            
            course.students.remove(student)
            return {
                "success": True,
                "detail": f"Student {student.username} removed",
                "status": status.HTTP_200_OK
            }
            
        except User.DoesNotExist:
            return {
                "success": False,
                "detail": "Student not found",
                "status": status.HTTP_404_NOT_FOUND
            }


class LectureService:
    
    @staticmethod
    def create_lecture(serializer, user):
        if not user.is_teacher():
            raise PermissionDenied("Only teachers can create lectures")
        return serializer.save()


class HomeworkService:
    
    @staticmethod
    def create_homework(serializer, user, lecture_id=None):
        if not user.is_teacher():
            raise PermissionDenied("Only teachers can create homework")

        if lecture_id:
            return serializer.save(lecture_id=lecture_id)
        else:
            return serializer.save()


class SubmissionService:
    
    @staticmethod
    def create_submission(serializer, user):
        if not user.is_student():
            raise PermissionDenied("Only students can submit homework")
        return serializer.save(student=user)


class GradeService:
        
    @staticmethod
    def create_grade(serializer, user):
        if not user.is_teacher():
            raise PermissionDenied("Only teachers can grade")
        return serializer.save(teacher=user)