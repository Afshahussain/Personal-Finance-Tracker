from rest_framework import serializers
from category.models import Category
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_type = serializers.CharField(source="category.type", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "title",
            "amount",
            "category",
            "category_name",
            "category_type",
            "payment_mode",
            "date",
            "description",
        ]
        read_only_fields = ["id", "category_name", "category_type"]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user if request else None
        category = attrs.get("category")

        if category and category.user != user:
            raise serializers.ValidationError(
                {"category": "You can only use your own categories."}
            )

        return attrs