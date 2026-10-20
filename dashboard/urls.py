from django.urls import path
from .views import DashboardView,ReportView

urlpatterns = [
    path("summary/", DashboardView.as_view(), name="dashboard"),
    path("reports/", ReportView.as_view(), name="reports"),
]