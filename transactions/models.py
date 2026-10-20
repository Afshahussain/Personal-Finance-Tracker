from django.db import models
from django.contrib.auth.models import User
from category.models import Category


class Transaction(models.Model):
    PAYMENT_MODE_CHOICES = (
        ("Cash", "Cash"),
        ("UPI", "UPI"),
        ("Debit Card", "Debit Card"),
        ("Credit Card", "Credit Card"),
        ("Bank Transfer", "Bank Transfer"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="transactions")
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title