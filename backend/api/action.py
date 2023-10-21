import jwt
import base64
from rest_framework import status
from django.http import JsonResponse
from django.core.files.base import ContentFile
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
import time

from core.settings import SECRET_KEY, ALGORITHM
from .models import User


class Pagination(PageNumberPagination):
    # Set the default page size for pagination
    page_size = 150

    # Define the query parameter for specifying page size in the request
    page_size_query_param = 'size'

    # Set the maximum allowed page size
    max_page_size = 150

    # Define the query parameter for specifying the current page in the request
    page_query_param = 'page'
    
    def get_paginated_response(self, data):
        # Customize the pagination response format
        return Response({
            'data': data,  # The data to paginate
            'totalPages': self.page.paginator.num_pages,  # Total number of pages
            'totalElements': self.page.paginator.count,  # Total number of items
            'size': self.get_page_size(self.request),  # Size of the current page
            'currentPage': self.page.number,  # Current page number
        })


def base64_file(data, name=None):
    _format, _img_str = data.split(';base64,')
    _name, ext = _format.split('/')
    if not name:
        name = _name.split(":")[-1]
    return ContentFile(base64.b64decode(_img_str), name='{}.{}'.format(name, ext))

def auth_handler(view_func):
    def wrapper(request, *args, **kwargs):
        token = request.COOKIES.get('__lunar_jwt') or request.headers.get('Authorization').split(' ')[1]
        
        if not token:
            return JsonResponse(data={'message': 'Unauthenticated!'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user = User.objects.get(email=payload['email'])
        except jwt.ExpiredSignatureError as e:
            return JsonResponse(data={'message': 'Token has expired!'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.DecodeError as e:
            # Print the specific exception message for debugging
            print(f"JWT Decode Error: {e}")
            return JsonResponse(data={'message': 'Token is invalid!'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist as e:
            response = Response()
            response.delete_cookie('__lunar_jwt')
            response.data = {'message': 'User does not exist!'}
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return response
        
        # If authentication is successful, call the view function
        return view_func(request, user=user, *args, **kwargs)
    
    return wrapper
