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
        fields = ['id', 'lecture', 'text', 'description', 'deadline']

class GradeSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    submission = serializers.PrimaryKeyRelatedField(queryset=Submission.objects.all())

    class Meta:
        model = Grade
        fields = ['id', 'submission', 'teacher', 'score', 'comment', 'graded_at']

    def validate(self, data):
        # Проверяем, что для этого submission еще нет оценки
        submission = data.get('submission')
        if submission and Grade.objects.filter(submission=submission).exists():
            raise serializers.ValidationError({
                'submission': 'Grade for this submission already exists.'
            })
        
        # Проверяем score
        score = data.get('score')
        if score is not None and (score < 0 or score > 100):
            raise serializers.ValidationError({
                'score': 'Score must be between 0 and 100'
            })
        
        return data

# Сериализатор для сабмишенов с вложенной оценкой
class SubmissionSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    grade = GradeSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'homework', 'student', 'content', 'submitted_at', 'grade']

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)
        