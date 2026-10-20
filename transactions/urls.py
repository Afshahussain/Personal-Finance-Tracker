from django.urls import path
from .views import (
    CreateTransactionView,
    TransactionListView,
    UpdateTransactionView,
    DeleteTransactionView,
)

urlpatterns = [
    path("create/", CreateTransactionView.as_view(), name="create-transaction"),
    path("list/", TransactionListView.as_view(), name="list-transaction"),
    path("update/<int:pk>/", UpdateTransactionView.as_view(), name="update-transaction"),
    path("delete/<int:pk>/", DeleteTransactionView.as_view(), name="delete-transaction"),
]