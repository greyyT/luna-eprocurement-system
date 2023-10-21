from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http.response import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from passlib.hash import sha256_crypt
import jwt, datetime

from .serializers import UserSerializer
from api.models import User
from core.settings import SECRET_KEY, ALGORITHM


class RegisterView(APIView):
    def post(self, request):
        # Deserialize the request data using your UserSerializer
        serializer = UserSerializer(data=request.data)
        
        # Check if the data is valid based on your serializer's validation rules
        if serializer.is_valid():
            
            # User is valid and does not exist, save it
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Data is not valid, return an error response with validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        # Get email and password from the request data
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Find the user by email
        user = User.objects.filter(email=email).first()
        
        if user is None:
            # User not found, return a 404 response
            return JsonResponse(data={"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not sha256_crypt.verify(password, user.password):
            # Incorrect password, return a 400 Bad Request response
            return JsonResponse(data={"message": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate a JWT token with an expiration time (48 hours in this example)
        payload = {
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=48),
            'iat': datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        
        # Create a response object
        response = Response()
        
        # Set an HTTP-only cookie with the JWT token
        response.set_cookie(key='__lunar_jwt', value=token, httponly=True, samesite='none', secure=True)
        response.data = {
            'access_token': token,
        }
        
        # Return the response
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie(key='__lunar_jwt')
        return response