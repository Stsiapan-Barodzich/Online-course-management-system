from django.db import models
from users.models import User

class Course(models.Model):
    title = models.CharField(max_length=200)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'TEACHER'})
    students = models.ManyToManyField(User, related_name='courses', limit_choices_to={'role': 'STUDENT'})

class Lecture(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    topic = models.CharField(max_length=200)
    presentation = models.FileField(upload_to='presentations/')

class Homework(models.Model):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    text = models.TextField()

class Submission(models.Model):
    homework = models.ForeignKey(Homework, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'STUDENT'})
    content = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

class Grade(models.Model):
    submission = models.OneToOneField(Submission, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'TEACHER'})
    score = models.IntegerField(null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    graded_at = models.DateTimeField(auto_now_add=True)