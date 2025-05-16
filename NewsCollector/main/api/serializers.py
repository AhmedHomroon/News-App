
from dataclasses import field
from pyexpat import model
from main.models import Category, News, Rate
from main.models import * 
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
User = get_user_model()  # Get the custom user model, if any


class RateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Rate
        fields = ['id', 'rate', 'user', 'news']
        read_only_fields = ['user', 'news']       

    """rate": "5",
        "user": 2,
        "news": 1# """   

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields='__all__'

class NewsSerializer(serializers.ModelSerializer):
    rates = RateSerializer(many=True, read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())  # Important!
    image_url = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(read_only=True)   # Or serializers.CharField()
    image_name = serializers.CharField(
        max_length=255, required=False
    )  # Make image_name optional
    # created_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ")  # ISO 8601
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = News
        # fields = ['id', 'title', 'content', 'source', 'category', 'created_at', 'updated_at','image_url', 'image_name', 'user', 'rates']
        fields = '__all__' 
        # fields = ["id",'title', 'content', 'source', 'category', 'image_url', 'image_name']
        read_only_fields = ('user', 'created_at', 'updated_at', 'image_name') 


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']    



            