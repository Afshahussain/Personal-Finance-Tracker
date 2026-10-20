from django.urls import path
from .views import (
    CreateBudgetView,
    BudgetListView,
    UpdateBudgetView,
    DeleteBudgetView,
)

urlpatterns = [
    path("create/", CreateBudgetView.as_view(), name="create-budget"),
    path("list/", BudgetListView.as_view(), name="list-budget"),
    path("update/<int:pk>/", UpdateBudgetView.as_view(), name="update-budget"),
    path("delete/<int:pk>/", DeleteBudgetView.as_view(), name="delete-budget"),
]