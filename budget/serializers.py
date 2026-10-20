from rest_framework import serializers
from .models import Budget
from category.models import Category


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_type = serializers.CharField(source="category.type", read_only=True)

    class Meta:
        model = Budget
        fields = [
            "id",
            "category",
            "category_name",
            "category_type",
            "amount",
            "month",
        ]
        read_only_fields = ["id", "category_name", "category_type"]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Budget amount must be greater than 0.")
        return value

    def validate_month(self, value):
        if len(value) != 7:
            raise serializers.ValidationError("Month must be in YYYY-MM format.")
        return value

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user if request else None
        category = attrs.get("category")
        month = attrs.get("month")

        if category and category.user != user:
            raise serializers.ValidationError(
                {"category": "You can only use your own categories."}
            )

        if category and category.type != "Expense":
            raise serializers.ValidationError(
                {"category": "Budget can only be set for expense categories."}
            )

        queryset = Budget.objects.filter(user=user, category=category, month=month)

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)

        if queryset.exists():
            raise serializers.ValidationError(
                {"message": "Budget already exists for this category and month."}
            )

        return attrs