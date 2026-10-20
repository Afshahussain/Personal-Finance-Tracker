from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    CATEGORY_TYPE_CHOICES = (
        ("Income", "Income"),
        ("Expense", "Expense"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=CATEGORY_TYPE_CHOICES)

    class Meta:
        unique_together = ("user", "name")

    def __str__(self):
        return f"{self.name} - {self.type}"