from rest_framework import serializers
from .models import Course, Lecture, Homework, Submission, Grade
from users.serializers import UserSerializer

class CourseSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    students = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'teacher', 'students']

    def create(self, validated_data):
        validated_data['teacher'] = self.context['request'].user
        return super().create(validated_data)

class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ['id', 'course', 'topic', 'presentation']

class HomeworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homework
        fields = ['id', 'lecture', 'text']

class SubmissionSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'homework', 'student', 'content', 'submitted_at']

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)

class GradeSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    submission = SubmissionSerializer(read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'submission', 'teacher', 'score', 'comment', 'graded_at']

    def create(self, validated_data):
        validated_data['teacher'] = self.context['request'].user
        return super().create(validated_data)