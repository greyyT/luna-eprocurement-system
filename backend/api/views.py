from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from django.core.files.storage import default_storage

from .action import auth_handler, Pagination
from .models import User, LegalEntity, Role, Department, Team, Product, Vendor, Price, Contact, Project, PurchaseRequisition, Comment
from .serializers import (
    UserInfoSerializer, 
    UserLegalEntitySerializer, 
    LegalEntitySerializer, 
    DepartmentSerializer, 
    TeamSerializer,
    RoleSerializer,
    ProductSerializer,
    PriceSerializer,
    PatchPriceSerializer,
    VendorSerializer,
    ContactSerializer,
    ProjectSerializer,
    PatchProjectSerializer,
    ProductPurchaseRequisitionSerializer,
    PurchaseRequisitionSerializer,
    SetStatusPurchaseRequisitionSerializer,
    CommentSerializer
)

@api_view(['GET'])
@auth_handler
def get_user(request, user: User):
    try:
        # Create a serializer instance with the retrieved user data
        serializer = UserInfoSerializer(user)
        
        # Return the serialized user data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({"message": "An error has occured while retrieving user info"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@auth_handler
def create_legal_entity(request, user: User):
    data = request.data
    
    try:
        # Check if user is belonged to any Legal Entity
        if user.legal_entity:
            return Response({"message": "User has already in a Legal Entity"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a serializer instance with the provided data
        serializer = LegalEntitySerializer(data=data)
        
        if serializer.is_valid():
            # Save the legal entity using the serializer
            legal_entity = serializer.save()

            # Define default roles to be created for the legal entity
            default_roles = [
                {"role": "ADMINISTRATOR", "approve": True, "reject": True},
                {"role": "MANAGER", "approve": True, "reject": True},
                {"role": "MEMBER", "approve": True, "reject": True},
                {"role": "VIEWER", "approve": True, "reject": True},
                {"role": "SUPERVISOR", "approve": True, "reject": True},
            ]

            # Create default roles for the legal entity
            for role_data in default_roles:
                Role.objects.create(legal_entity=legal_entity, **role_data)

            # Retrieve the manager role within the legal entity
            manager_role = legal_entity.roles.get(role="MANAGER")
            
            # Update the user's legal_entity and role fields
            user.legal_entity = legal_entity
            user.role = manager_role
            
            # Save the user instance to apply the changes
            user.save()

            # Return a success response with the serialized legal entity data
            return Response({"message": "Legal Entity created successfully"}, status=status.HTTP_200_OK)
        else:
            # Handle the case where the serializer data is invalid
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except:
        return Response({"message": "An error has occured while creating Legal Entity"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@auth_handler
def join_legal_entity(request, user: User):
    data = request.data
    
    try:
        # Check if user is belonged to any Legal Entity
        if user.legal_entity:
            return Response({"message": "User has already in a Legal Entity"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Retrieve the legal entity based on the provided legalEntityCode
        legal_entity = LegalEntity.objects.get(legal_entity_code=data["legalEntityCode"])
        
        # Retrieve the member role within the legal entity
        member_role = legal_entity.roles.get(role="MEMBER")
        
        # Update the user's legal_entity and role fields
        user.legal_entity = legal_entity
        user.role = member_role
        
        # Save the user instance to apply the changes
        user.save()
        
        # Return a success response
        return Response({"message": "Successfully joined Legal Entity"}, status=status.HTTP_200_OK)
    
    except LegalEntity.DoesNotExist:
        # Handle the case where the provided Legal Entity Code does not exist
        return Response({"message": "Legal Entity Code not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while joining Legal Entity"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
@auth_handler
def delete_user_from_legal_entity(request, user: User, account_id):
    try: 
        if user.role.role != 'MANAGER':
            return Response({"message": "Only manager can perform this action"}, status=status.HTTP_403_FORBIDDEN)

        member = User.objects.get(id=account_id)
        
        member.legal_entity = None
        member.department = None
        member.team = None
        member.role = None
        
        member.save()
        
        return Response({"message": "Successfully removed user from Legal Entity"})
    except:
        return Response({"message": "An error has occured while removing user from Legal Entity"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@auth_handler
def list_legal_entity_accounts(request, user: User):
    try:
        if user.role.role != 'MANAGER':
            return Response({"message": "Only manager can perform this action"}, status=status.HTTP_403_FORBIDDEN)
        
        # Get the legal entity associated with the user
        legal_entity = user.legal_entity
        
        # Create an instance of the custom Pagination class
        paginator = Pagination()
        
        # Query users associated with the legal entity
        users = legal_entity.users.all().order_by('id')
        
        # Paginate the queryset based on the request
        users = paginator.paginate_queryset(users, request)
        
        # Serialize the paginated queryset
        serializer = UserLegalEntitySerializer(users, many=True)
        
        # Return the paginated response using the custom pagination format
        return paginator.get_paginated_response(serializer.data)
    except:
        return Response({"message": "An error has occured while retrieving Legal Entity accounts"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@auth_handler
def get_legal_entity(request, user: User):
    try:
        if user.role.role != 'MANAGER':
            return Response({"message": "Only manager can perform this action"}, status=status.HTTP_403_FORBIDDEN)
        
        legal_entity = user.legal_entity
        
        serializer = LegalEntitySerializer(legal_entity)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({"message": "An error has occured while retrieving Legal Entity info"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@auth_handler
def create_department(request, user: User):
    data = request.data
    
    try:
        if user.role.role != 'MANAGER':
            return Response({"message": "Only manager can perform this action"}, status=status.HTTP_403_FORBIDDEN)
        
        legal_entity = user.legal_entity
        
        serializer = DepartmentSerializer(data=data, legal_entity=legal_entity)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully created department"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "An error has occured while creating department"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["POST"])
@auth_handler
def set_department(request, user: User):
    data = request.data
    
    try:
        if user.role.role != 'MANAGER':
            return Response({"message": "Only manager can perform this action"}, status=status.HTTP_403_FORBIDDEN)
        
        member = User.objects.get(id=data["userId"])
        department = Department.objects.get(id=data["departmentId"])
        
        member.department = department
        member.team = None
        member.save()
        
        return Response({"message": "Successfully set user's department"})
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Department.DoesNotExist:
        return Response({"message": "Department not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while setting department"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["DELETE"])
@auth_handler
def delete_department(request, user: User, department_id):
    try:
        if user.role.role != 'MANAGER':
            return Response({"message": "Only manager can perform this action"}, status=status.HTTP_403_FORBIDDEN)
        
        department = Department.objects.get(id=department_id)
        department.delete()
        
        return Response({"message": "Successfully deleted department"})
    except Department.DoesNotExist:
        return Response({"message": "Department not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while deleting department"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@auth_handler
def create_team(request, user: User):
    data = request.data
    
    try:
        if user.role.role != 'MANAGER':
            return Response({"message": "Only manager can perform this action"}, status=status.HTTP_403_FORBIDDEN)

        department = Department.objects.get(id=data["departmentId"])
        
        serializer = TeamSerializer(data=data, department=department)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully created team"})
    except Department.DoesNotExist:
        return Response({"message": "Department not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while creating team"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@auth_handler
def set_team(request, user: User):
    data = request.data
    
    try:
        if user.role.role != 'MANAGER':
            return Response({"message": "Only manager can perform this action"}, status=status.HTTP_403_FORBIDDEN)
        
        member = User.objects.get(id=data["userId"])
        team = Team.objects.get(id=data["teamId"])
        
        member.team = team
        member.save()
        
        return Response({"message": "Successfully set user's team"})
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Team.DoesNotExist:
        return Response({"message": "Team not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while setting team"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@auth_handler
def set_role(request, user: User):
    data = request.data
    legal_entity = user.legal_entity
    
    try:
        if user.role.role != 'MANAGER':
            return Response({"message": "Only manager can perform this action"}, status=status.HTTP_403_FORBIDDEN)
        
        if user.id == data["userId"]:
            return Response({"message": "Cannot set role to yourself"}, status=status.HTTP_400_BAD_REQUEST)
        
        member = User.objects.get(id=data["userId"])
        role = legal_entity.roles.get(role=data["role"])
        
        member.role = role
        member.save()
        
        return Response({"message": "Successfully set user's role"})
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Role.DoesNotExist:
        return Response({"message": "Role not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while setting role"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PATCH', 'GET'])
@auth_handler
def list_or_update_role(request, user: User):
    data = request.data
    legal_entity = user.legal_entity
    
    if request.method == 'GET':
        roles = legal_entity.roles.all().order_by('role')
        serializer = RoleSerializer(roles, many=True)
        
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        role = Role.objects.get(id=data["id"])
        
        serializer = RoleSerializer(role, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully updated role"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST', 'GET'])
@auth_handler
def create_and_list_product(request, user: User):
    data = request.data
    legal_entity = user.legal_entity
    
    if request.method == 'GET':    
        paginator = Pagination()
        
        search_query = request.query_params.get('search')
        
        try:
            if search_query:
                products = legal_entity.products.filter(
                    Q(name__icontains=search_query) |
                    Q(code__icontains=search_query) |
                    Q(prices__vendor__code__icontains=search_query)
                ).order_by('name')
            else:
                products = legal_entity.products.all().order_by('id')
        except Product.DoesNotExist:
            return Response({"message": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"message": "An error has occured while retrieving products"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        products = paginator.paginate_queryset(products, request)
        
        serializer = ProductSerializer(products, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProductSerializer(data=data, legal_entity=legal_entity)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully created product"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET', 'DELETE'])
@auth_handler
def delete_and_get_product(request, user: User, product_code):
    legal_entity = user.legal_entity
    
    try:
        product = legal_entity.products.get(code=product_code)
    except Product.DoesNotExist:
        return Response({"message": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while retrieving product info"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == 'DELETE':
        image_file = product.image
        
        product.delete()

        if image_file:
            try:
                default_storage.delete(image_file.name)
            except:
                pass
            
        return Response({"message": "Successfully deleted product"})
    
    elif request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)    
    
@api_view(['POST'])
@auth_handler
def assign_price_to_product(request, user: User):
    data = request.data
    legal_entity = user.legal_entity
    
    try:
        product = legal_entity.products.get(id=data["productId"])
        vendor = legal_entity.vendors.get(code=data["vendorCode"])
    except Product.DoesNotExist:
        return Response({"message": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    except Vendor.DoesNotExist:
        return Response({"message": "Vendor not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while assigning price to product"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    price = PriceSerializer(data=data, product=product, vendor=vendor)
    
    if price.is_valid():
        price.save()
        return Response({"message": "Successfully assigned price to product"})
    else:
        return Response(price.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PATCH'])
@auth_handler
def update_price(request, user: User):
    data = request.data
    
    price = Price.objects.get(id=data["id"])
    
    serializer = PatchPriceSerializer(price, data=data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Successfully updated price"})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE', 'PATCH'])
@auth_handler
def delete_and_update_price(request, user: User, price_id):
    data = request.data
    
    try:
        price = Price.objects.get(id=price_id)
    except:
        return Response({"message": "Price not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        price.delete()
        return Response({"message": "Successfully deleted price"})
    
    elif request.method == 'PATCH':
        serializer = PatchPriceSerializer(price, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully updated price"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"message": "Successfully deleted price"})
    
@api_view(['POST', 'GET'])
@auth_handler
def create_and_list_vendor(request, user: User):
    data = request.data
    legal_entity = user.legal_entity

    if request.method == 'POST':
        
        serializer = VendorSerializer(data=data, legal_entity=legal_entity)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully created vendor"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == 'GET':
        search_query = request.query_params.get('search')
        
        paginator = Pagination()
        
        if search_query:
            vendors = legal_entity.vendors.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query) |
                Q(business_num__icontains=search_query)
            ).order_by('id')
        else:
            vendors = legal_entity.vendors.all().order_by('id')

        vendors = paginator.paginate_queryset(vendors, request)
        
        serializer = VendorSerializer(vendors, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
@api_view(['GET', 'DELETE'])
@auth_handler
def delete_and_get_vendor(request, user: User, vendor_code):
    legal_entity = user.legal_entity
    vendor = legal_entity.vendors.get(code=vendor_code)
    
    if request.method == 'DELETE':
        image_file = vendor.image
        
        vendor.delete()
        
        if image_file:
            try:
                default_storage.delete(image_file.name)
            except:
                pass
        
        return Response({"message": "Successfully deleted vendor"})
    
    elif request.method == 'GET':
        serializer = VendorSerializer(vendor)
        return Response(serializer.data)

@api_view(['POST'])
@auth_handler
def create_contact_in_vendor(request, user: User):
    data = request.data
    
    legal_entity = user.legal_entity
    vendor = legal_entity.vendors.get(id=data["vendorId"])
    
    serializer = ContactSerializer(data=data, vendor=vendor)
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Successfully added contact"})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@auth_handler
def delete_contact(request, user: User, contact_id):
    try:
        contact = Contact.objects.get(id=contact_id)
        contact.delete()
        return Response({"message": "Successfully deleted contact"})
    
    except Contact.DoesNotExist:
        return Response({"message": "Contact not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while deleting contact"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST', 'GET'])
@auth_handler
def create_and_list_project(request, user: User):
    data = request.data
    legal_entity = user.legal_entity
    
    if request.method == 'POST':
        serializer = ProjectSerializer(data=data, legal_entity=legal_entity)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully created project"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == 'GET':
        search_query = request.query_params.get('search')
        paginator = Pagination()
        
        if search_query:
            projects = legal_entity.projects.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query) |
                Q(label__icontains=search_query)
            ).order_by('id')
        else:
            projects = legal_entity.projects.all().order_by('id')
        
        projects = paginator.paginate_queryset(projects, request)
        
        serializer = ProjectSerializer(projects, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
@api_view(['PATCH', 'DELETE'])
@auth_handler
def delete_and_update_project(request, user: User, project_code):
    data = request.data
    
    legal_entity = user.legal_entity
    project = legal_entity.projects.get(code=project_code)
    
    if request.method == 'PATCH':
        serializer = PatchProjectSerializer(project, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully changed project name"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        project_counts = legal_entity.projects.count()
        
        if project.is_default and project_counts > 1:
            return Response({"message": "Delete remaining projects before deleting default project"}, status=status.HTTP_400_BAD_REQUEST)
        
        project.delete()
        return Response({"message": "Successfully deleted project"})
    
@api_view(['POST'])
@auth_handler
def mark_default_project(request, user: User, project_code):
    legal_entity = user.legal_entity
    project = legal_entity.projects.get(code=project_code)
    
    if project.is_default:
        return Response({"message": "Project is already default project"})
    
    default_project = legal_entity.projects.get(is_default=True)
    
    project.is_default = True
    default_project.is_default = False
    project.save()
    default_project.save()
    
    return Response({"message": "Successfully marked project as default project"})

@api_view(['POST', 'GET'])
@auth_handler
def create_and_list_purchase_requisition(request, user: User):
    data = request.data
    legal_entity = user.legal_entity
    
    if request.method == 'POST':
        try:
            project = legal_entity.projects.get(code=data["projectCode"])
        except Project.DoesNotExist:
            return Response({"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'POST':
            serializer = PurchaseRequisitionSerializer(data=data, user=user, legal_entity=legal_entity, project=project)
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            purchase_requisition = serializer.save()
                
            if len(data["products"]) > 0:
                serializer = ProductPurchaseRequisitionSerializer(data=data["products"], many=True, purchase_requisition=purchase_requisition)
                
                if not serializer.is_valid():
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                serializer.save()

            return Response({"message": "Successfully created purchase requisition"})
        
    elif request.method == 'GET':
        paginator = Pagination()
        
        search_query = request.query_params.get('search')
        
        if search_query:
            purchase_requisitions = legal_entity.purchase_requisitions.filter(
                Q(project__code__icontains=search_query) |
                Q(name__icontains=search_query)
            ).order_by('name')
        else:
            purchase_requisitions = legal_entity.purchase_requisitions.all().order_by('id')
        
        purchase_requisitions = paginator.paginate_queryset(purchase_requisitions, request)
        
        serializer = PurchaseRequisitionSerializer(purchase_requisitions, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
@api_view(['GET', 'DELETE'])
@auth_handler
def get_and_delete_purchase_requisition(request, user: User, purchase_requisition_id):
    legal_entity = user.legal_entity
    
    try:
        purchase_requisition = legal_entity.purchase_requisitions.get(id=purchase_requisition_id)
    except PurchaseRequisition.DoesNotExist:
        return Response({"message": "Purchase Requisition not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while retrieving Purchase Requisition info"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == 'GET':
        serializer = PurchaseRequisitionSerializer(purchase_requisition)
        return Response(serializer.data)
        
    elif request.method == 'DELETE':
        purchase_requisition.delete()
        return Response({"message": "Successfully deleted purchase requisition"})
    
@api_view(['POST'])
@auth_handler
def set_purchase_requisition_status(request, user: User, purchase_requisition_id):
    data = request.data
    legal_entity = user.legal_entity
    
    try:
        purchase_requisition: PurchaseRequisition = legal_entity.purchase_requisitions.get(id=purchase_requisition_id)
        project = purchase_requisition.project
    except PurchaseRequisition.DoesNotExist:
        return Response({"message": "Purchase Requisition not found"}, status=status.HTTP_404_NOT_FOUND)
    except Project.DoesNotExist:
        return Response({"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if purchase_requisition.status == 'COMPLETED' or purchase_requisition.status == 'CANCELLED':
        return Response({"message": "Purchase Requisition is already completed or cancelled"}, status=status.HTTP_400_BAD_REQUEST)
    if purchase_requisition.is_approved == False:
        if data["status"] == 'COMPLETED' or data["status"] == 'TO_DO' or data["status"] == 'IN_PROGRESS':
            return Response({"message": "Purchase Requisition is not approved yet"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if data["status"] == 'WAITING_TO_APPROVAL':
            return Response({"message": "Purchase Requisition is already approved"}, status=status.HTTP_400_BAD_REQUEST)
        
    if data["status"] == "COMPLETED":
        total_price = purchase_requisition.total_price
        
        if project.purchase_allowance < project.current_purchase + total_price:
            return Response({"message": "Purchase Requisition exceeds project's purchase allowance"}, status=status.HTTP_400_BAD_REQUEST)
        
        project.current_purchase += total_price
        project.purchase_count += 1
    
    serializer = SetStatusPurchaseRequisitionSerializer(purchase_requisition, data=data, partial=True)
    
    if serializer.is_valid():
        purchase_requisition = serializer.save()
        project.save()
                
        return Response({"message": "Successfully updated purchase requisition status"})
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@auth_handler
def approve_purchase_requisition(request, user: User, purchase_requisition_id):
    legal_entity = user.legal_entity
    
    try:
        purchase_requisition = legal_entity.purchase_requisitions.get(id=purchase_requisition_id)
    except PurchaseRequisition.DoesNotExist:
        return Response({"message": "Purchase Requisition not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if purchase_requisition.status != 'WAITING_TO_APPROVAL':
        return Response({"message": "Purchase Requisition is not waiting to approval"}, status=status.HTTP_400_BAD_REQUEST)
    
    purchase_requisition.is_approved = True
    purchase_requisition.status = 'IN_PROGRESS'
    purchase_requisition.save()
    
    return Response({"message": "Successfully approved purchase requisition"})

@api_view(['POST'])
@auth_handler
def reject_purchase_requisition(request, user: User, purchase_requisition_id):
    legal_entity = user.legal_entity
    data = request.data
    
    if not data["comment"] or data["comment"] == "":
        return Response({"message": "Comment is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        purchase_requisition = legal_entity.purchase_requisitions.get(id=purchase_requisition_id)
    except PurchaseRequisition.DoesNotExist:
        return Response({"message": "Purchase Requisition not found"}, status=status.HTTP_404_NOT_FOUND)
    
    purchase_requisition.is_rejected = True
    purchase_requisition.is_approved = False
    purchase_requisition.status = 'CANCELLED'
    purchase_requisition.rejected_comment = data["comment"]
    purchase_requisition.save()
    
    return Response({"message": "Successfully rejected purchase requisition"})
    
@api_view(['POST', 'GET'])
@auth_handler
def post_and_list_comment_purchase_requisition(request, user: User, purchase_requisition_id):
    legal_entity = user.legal_entity
    
    try:
        purchase_requisition = legal_entity.purchase_requisitions.get(id=purchase_requisition_id)
    except PurchaseRequisition.DoesNotExist:
        return Response({"message": "Purchase Requisition not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while retrieving Purchase Requisition info"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == 'POST':
        serializer = CommentSerializer(data=request.data, purchase_requisition=purchase_requisition, user=user)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully updated purchase requisition status"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'GET':
        paginator = Pagination()
        
        comments = purchase_requisition.comments.all().order_by('-created_at')
        
        comments = paginator.paginate_queryset(comments, request)
        
        serializer = CommentSerializer(comments, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
@api_view(['DELETE', 'PATCH'])
@auth_handler
def delete_and_update_comment_purchase_requisition(request, user: User, purchase_requisition_id, comment_id):
    data = request.data
    legal_entity = user.legal_entity
    
    try:
        purchase_requisition = legal_entity.purchase_requisitions.get(id=purchase_requisition_id)
        comment: Comment = purchase_requisition.comments.get(id=comment_id)
    except PurchaseRequisition.DoesNotExist:
        return Response({"message": "Purchase Requisition not found"}, status=status.HTTP_404_NOT_FOUND)
    except Comment.DoesNotExist:
        return Response({"message": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "An error has occured while retrieving Purchase Requisition info"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == 'DELETE':
        comment.delete()
        return Response({"message": "Successfully deleted comment"})
    
    elif request.method == 'PATCH':
        serializer = CommentSerializer(comment, data=data, partial=True)
        
        if serializer.is_valid():
            comment = serializer.save()
            comment.is_updated = True
            comment.save()
            return Response({"message": "Successfully updated comment"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)