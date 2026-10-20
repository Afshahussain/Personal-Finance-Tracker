from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer

class CreateTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransactionSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "message": "Transaction created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by("-date", "-id")
        serializer = TransactionSerializer(transactions, many=True)

        return Response(
            {
                "message": "Transactions fetched successfully",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

class UpdateTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            transaction = Transaction.objects.get(id=pk, user=request.user)
        except Transaction.DoesNotExist:
            return Response(
                {"message": "Transaction not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TransactionSerializer(
            transaction,
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Transaction updated successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            transaction = Transaction.objects.get(id=pk, user=request.user)
        except Transaction.DoesNotExist:
            return Response(
                {"message": "Transaction not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        transaction.delete()
        return Response(
            {"message": "Transaction deleted successfully"},
            status=status.HTTP_200_OK
        )