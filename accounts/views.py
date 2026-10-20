from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignupSerializer, LoginSerializer


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = SignupSerializer(data=request.data)

            if serializer.is_valid():
                user = serializer.save()

                refresh = RefreshToken.for_user(user)

                return Response(
                    {
                        "status":True,
                        "message": "Account created successfully.",
                        "user": {
                            "id": user.id,
                            "name": user.first_name,
                            "email": user.email,
                        },
                        "tokens": {
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                    },
                    status=status.HTTP_201_CREATED,
                )

            return Response(
                {
                    "status": False,
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response({"status":False,"message": str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR,)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)

            if serializer.is_valid():
                user = serializer.validated_data["user"]
                refresh = RefreshToken.for_user(user)

                return Response(
                    {
                        "status":True,
                        "message": "Login successful.",
                        "user": {
                            "id": user.id,
                            "name": user.first_name,
                            "email": user.email,
                        },
                        "tokens": {
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {
                    "status": False,
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response({"status":False,"message": str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
