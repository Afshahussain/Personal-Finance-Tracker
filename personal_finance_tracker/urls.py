from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounts/',include('accounts.urls')),
    path('api/v1/category/',include('category.urls')),
    path('api/v1/transactions/',include('transactions.urls')),
    path('api/v1/budget/',include('budget.urls')),
    path('api/v1/dashboard/',include('dashboard.urls')),
]
