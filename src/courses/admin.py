from django.contrib import admin
from .models import Course, Lecture, Homework, Submission, Grade

admin.site.register(Course)
admin.site.register(Lecture)
admin.site.register(Homework)
admin.site.register(Submission)
admin.site.register(Grade)
