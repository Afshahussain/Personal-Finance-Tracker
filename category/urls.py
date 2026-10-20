from django.urls import path
from .views import (
    CreateCategoryView,
    CategoryListView,
    UpdateCategoryView,
    DeleteCategoryView,
)

urlpatterns = [
    path("create/", CreateCategoryView.as_view(), name="create-category"),
    path("list/", CategoryListView.as_view(), name="list-category"),
    path("update/<int:pk>/", UpdateCategoryView.as_view(), name="update-category"),
    path("delete/<int:pk>/", DeleteCategoryView.as_view(), name="delete-category"),
]