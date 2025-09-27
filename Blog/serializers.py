from rest_framework import serializers
from .models import BlogPost, Comment

class RecursiveCommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at", "replies"]

    def get_replies(self, obj):
        return RecursiveCommentSerializer(obj.replies.all(), many=True).data
    

class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class CommentSerializer(serializers.ModelSerializer):
    replies = RecursiveField(many=True, read_only=True)
    user = serializers.StringRelatedField()
    class Meta:
        model = Comment
        fields = ["id", "post", "user", "parent", "content", "created_at", "replies"]
        read_only_fields = ["user", "created_at", "replies"]


class BlogPostSerializer(serializers.ModelSerializer):
    comments = RecursiveCommentSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "content", "image",
            "created_at", "updated_at", "likes_count", "reads", "comments"
        ]
        read_only_fields = ["slug", "created_at", "updated_at", "likes_count", "reads"]
