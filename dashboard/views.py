from decimal import Decimal
from datetime import datetime
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from transactions.models import Transaction
from category.models import Category
from budget.models import Budget
from transactions.serializers import TransactionSerializer


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        current_month = datetime.now().strftime("%Y-%m")

        income_total = (
            Transaction.objects.filter(user=user, category__type="Income")
            .aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        expense_total = (
            Transaction.objects.filter(user=user, category__type="Expense")
            .aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        total_monthly_budget = (
            Budget.objects.filter(user=user, month=current_month)
            .aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        net_balance = income_total - expense_total

        total_categories = Category.objects.filter(user=user).count()
        total_transactions = Transaction.objects.filter(user=user).count()
        total_budgets = Budget.objects.filter(user=user).count()

        recent_transactions = Transaction.objects.filter(user=user).order_by("-date", "-id")[:5]
        recent_transactions_data = TransactionSerializer(recent_transactions, many=True).data

        return Response(
            {
                "message": "Dashboard data fetched successfully",
                "data": {
                    "total_income": str(income_total),
                    "total_expense": str(expense_total),
                    "net_balance": str(net_balance),
                    "total_monthly_budget": str(total_monthly_budget),
                    "total_categories": total_categories,
                    "total_transactions": total_transactions,
                    "total_budgets": total_budgets,
                    "recent_transactions": recent_transactions_data,
                },
            },
            status=status.HTTP_200_OK,
        )

class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        current_month = datetime.now().strftime("%Y-%m")

        # 1. Category-wise expense report
        expense_categories = (
            Transaction.objects.filter(user=user, category__type="Expense")
            .values("category__id", "category__name")
            .annotate(total_amount=Sum("amount"))
            .order_by("-total_amount")
        )

        expense_report = [
            {
                "category_id": item["category__id"],
                "category_name": item["category__name"],
                "total_amount": str(item["total_amount"] or Decimal("0.00")),
            }
            for item in expense_categories
        ]

        # 2. Category-wise income report
        income_categories = (
            Transaction.objects.filter(user=user, category__type="Income")
            .values("category__id", "category__name")
            .annotate(total_amount=Sum("amount"))
            .order_by("-total_amount")
        )

        income_report = [
            {
                "category_id": item["category__id"],
                "category_name": item["category__name"],
                "total_amount": str(item["total_amount"] or Decimal("0.00")),
            }
            for item in income_categories
        ]

        # 3. Monthly summary
        transactions = Transaction.objects.filter(user=user).order_by("date")

        monthly_data = {}

        for transaction in transactions:
            month_key = transaction.date.strftime("%Y-%m")

            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    "month": month_key,
                    "income": Decimal("0.00"),
                    "expense": Decimal("0.00"),
                }

            if transaction.category.type == "Income":
                monthly_data[month_key]["income"] += transaction.amount
            else:
                monthly_data[month_key]["expense"] += transaction.amount

        monthly_summary = []
        for month, values in monthly_data.items():
            monthly_summary.append(
                {
                    "month": values["month"],
                    "income": str(values["income"]),
                    "expense": str(values["expense"]),
                    "net_savings": str(values["income"] - values["expense"]),
                }
            )

        monthly_summary.sort(key=lambda x: x["month"])

        # 4. Budget vs spent for current month
        current_month_budgets = Budget.objects.filter(user=user, month=current_month)

        budget_vs_spent = []

        for budget in current_month_budgets:
            spent_amount = (
                Transaction.objects.filter(
                    user=user,
                    category=budget.category,
                    date__year=int(current_month.split("-")[0]),
                    date__month=int(current_month.split("-")[1]),
                ).aggregate(total=Sum("amount"))["total"]
                or Decimal("0.00")
            )

            remaining_amount = budget.amount - spent_amount

            if spent_amount > budget.amount:
                status_label = "Exceeded"
            elif spent_amount == budget.amount:
                status_label = "Reached"
            else:
                status_label = "Within Budget"

            budget_vs_spent.append(
                {
                    "category_id": budget.category.id,
                    "category_name": budget.category.name,
                    "budget_amount": str(budget.amount),
                    "spent_amount": str(spent_amount),
                    "remaining_amount": str(remaining_amount),
                    "status": status_label,
                    "month": budget.month,
                }
            )

        return Response(
            {
                "message": "Report data fetched successfully",
                "data": {
                    "expense_report": expense_report,
                    "income_report": income_report,
                    "monthly_summary": monthly_summary,
                    "budget_vs_spent": budget_vs_spent,
                },
            },
            status=status.HTTP_200_OK,
        )