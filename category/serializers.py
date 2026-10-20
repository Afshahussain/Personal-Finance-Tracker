from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "type"]
        read_only_fields = ["id"]

    def validate_name(self, value):
        return value.strip()

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user if request else None
        name = attrs.get("name", "").strip()

        queryset = Category.objects.filter(user=user, name__iexact=name)

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)

        if queryset.exists():
            raise serializers.ValidationError(
                {"name": "You already have a category with this name."}
            )

        return attrs