from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        TEACHER = "TEACHER", "Teacher"
        STUDENT = "STUDENT", "Student"

    role = models.CharField(max_length=16, choices=Role.choices)

    def is_teacher(self): return self.role == self.Role.TEACHER
    def is_student(self): return self.role == self.Role.STUDENT
