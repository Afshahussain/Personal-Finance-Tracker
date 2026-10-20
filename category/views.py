from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Category
from .serializers import CategorySerializer

class CreateCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CategorySerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "message": "Category created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.filter(user=request.user).order_by("id")
        serializer = CategorySerializer(categories, many=True)
        return Response(
            {
                "message": "Categories fetched successfully",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

class UpdateCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            category = Category.objects.get(id=pk, user=request.user)
        except Category.DoesNotExist:
            return Response(
                {"message": "Category not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CategorySerializer(
            category,
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Category updated successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            category = Category.objects.get(id=pk, user=request.user)
        except Category.DoesNotExist:
            return Response(
                {"message": "Category not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        category.delete()
        return Response(
            {"message": "Category deleted successfully"},
            status=status.HTTP_200_OK
        )