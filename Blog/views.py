from django.shortcuts import render
from .models import BlogPost, Comment
from .serializers import RecursiveCommentSerializer, BlogPostSerializer, CommentSerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.text import slugify

# Create your views here.
class BlogPostViewSet(viewsets.ModelViewSet):
    """
    view for BlogPost
    """
    queryset = BlogPost.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BlogPostSerializer
    lookup_field = "slug"

    def perform_create(self, serializer):
        slug = slugify(serializer.validated_data["title"])
        serializer.save(author=self.request.user, slug=slug)

    @action(detail=True, methods=["get", "post"], permission_classes=[permissions.IsAuthenticated])
    def comments(self, request, slug=None):
        """
        GET: list comments for this post
        POST: create a new comment on this post
        """
        post = self.get_object()

        if request.method == "GET":
            comments = Comment.objects.filter(post=post, parent=None) 
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        if request.method == "POST":
            serializer = CommentSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=201)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, slug=None):
        """
        Toggle like on a blog post
        """
        post = self.get_object()
        user = request.user
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({"detail": "Unliked"}, status=status.HTTP_200_OK)
        else:
            post.likes.add(user)
            return Response({"detail": "Liked"}, status=status.HTTP_200_OK)
        
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def dislike(self, request, slug=None):
        """
        Toggle dislike on a blog post
        """
        post = self.get_object()
        user = request.user
        if user in post.dislikes.all():
            post.dislikes.remove(user)
            return Response({"detail": "Undisliked"}, status=status.HTTP_200_OK)
        else:
            post.dislikes.add(user)
            return Response({"detail": "Disliked"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def increment_reads(self, request, slug=None):
        """
        Increment read count (triggered when a user views a post)
        """
        post = self.get_object()
        post.reads += 1
        post.save()
        return Response({"reads": post.reads}, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ModelViewSet):
    """
    view for Comment
    """
    queryset = Comment.objects.select_related("post", "user", "parent")
    permission_classes = [permissions.AllowAny]
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return super().get_permissions()
