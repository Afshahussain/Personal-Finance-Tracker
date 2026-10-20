from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Budget
from .serializers import BudgetSerializer


class CreateBudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BudgetSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "message": "Budget created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BudgetListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        budgets = Budget.objects.filter(user=request.user).order_by("-month", "-id")
        serializer = BudgetSerializer(budgets, many=True)

        return Response(
            {
                "message": "Budgets fetched successfully",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


class UpdateBudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            budget = Budget.objects.get(id=pk, user=request.user)
        except Budget.DoesNotExist:
            return Response(
                {"message": "Budget not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BudgetSerializer(
            budget,
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Budget updated successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteBudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            budget = Budget.objects.get(id=pk, user=request.user)
        except Budget.DoesNotExist:
            return Response(
                {"message": "Budget not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        budget.delete()
        return Response(
            {"message": "Budget deleted successfully"},
            status=status.HTTP_200_OK
        )