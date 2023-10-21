from rest_framework import serializers
from datetime import datetime
from .models import (
    LegalEntity, 
    Department, 
    Team, 
    Role,
    User, 
    Product, 
    Vendor, 
    Price, 
    Contact, 
    Project, 
    PurchaseRequisition, 
    ProductPurchaseRequisition, 
    Comment
)
from .action import base64_file


class UserInfoSerializer(serializers.ModelSerializer):
    legalEntityCode = serializers.SerializerMethodField()
    departmentCode = serializers.SerializerMethodField()
    teamCode = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    approve = serializers.BooleanField(source='role.approve', read_only=True)
    reject = serializers.BooleanField(source='role.reject', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'legalEntityCode', 'departmentCode', 'teamCode', 'role', 'approve', 'reject']
        
        
    def get_legalEntityCode(self, obj):
        return obj.legal_entity.legal_entity_code if obj.legal_entity else None
        
    def get_departmentCode(self, obj):
        return obj.department.code if obj.department else None
    
    def get_teamCode(self, obj):
        return obj.team.code if obj.team else None
    
    def get_role(self, obj):
        return obj.role.role if obj.role else None
    
    
class UserLegalEntitySerializer(serializers.ModelSerializer):
    legalEntityCode = serializers.SerializerMethodField()
    departmentCode = serializers.SerializerMethodField()
    departmentName = serializers.SerializerMethodField()
    teamCode = serializers.SerializerMethodField()
    teamName = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'legalEntityCode', 'departmentCode', 'departmentName', 'teamCode', 'teamName']
        
        
    def get_legalEntityCode(self, obj):
        return obj.legal_entity.legal_entity_code if obj.legal_entity else None
        
    def get_departmentCode(self, obj):
        return obj.department.code if obj.department else None
    
    def get_departmentName(self, obj):
        return obj.department.name if obj.department else None
    
    def get_teamCode(self, obj):
        return obj.team.code if obj.team else None
    
    def get_teamName(self, obj):
        return obj.team.name if obj.team else None
    
    def get_role(self, obj):
        return obj.role.role if obj.role else None
        
        
class TeamSerializer(serializers.ModelSerializer):
    teamCode = serializers.CharField(source="code")
    teamName = serializers.CharField(source="name")
    
    def __init__(self, *args, **kwargs):
        department = kwargs.pop('department', None)
        super().__init__(*args, **kwargs)
        self.department = department
    
    class Meta:
        model = Team
        fields = ['id', 'teamCode', 'teamName']
        
        
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        
        instance.department = self.department
        
        instance.save()
        
        return instance
    
    
class DepartmentSerializer(serializers.ModelSerializer):
    # Define the teams field using the TeamSerializer for nested serialization
    teams = TeamSerializer(many=True, read_only=True)
    
    # Map the 'code' field in the model to 'departmentCode' in the serializer
    departmentCode = serializers.CharField(source="code")
    
    # Map the 'name' field in the model to 'departmentName' in the serializer
    departmentName = serializers.CharField(source="name")
    
    def __init__(self, *args, **kwargs):
        legal_entity = kwargs.pop('legal_entity', None)
        super().__init__(*args, **kwargs)
        self.legal_entity = legal_entity
    
    class Meta:
        model = Department
        # Specify the fields to include in the serialized output
        fields = ['id', 'departmentCode', 'departmentName', 'teams']
    
    
    def create(self, validated_data):
        # Create a new Department instance with the validated data
        instance = self.Meta.model(**validated_data)
        
        # Set the 'legal_entity' field of the Department instance to the retrieved LegalEntity
        instance.legal_entity = self.legal_entity
        
        # Save the Department instance to the database
        instance.save()
        
        # Return the created Department instance
        return instance
        

class LegalEntitySerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    
    code = serializers.CharField(source='legal_entity_code')
    name = serializers.CharField(source='business_num')

    class Meta:
        model = LegalEntity
        fields = ['id', 'code', 'name', 'departments']
        
        
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'role', 'approve', 'reject']


class PriceSerializer(serializers.ModelSerializer):
    vendorCode = serializers.CharField(source='vendor.code', read_only=True)
    vendorName = serializers.CharField(source='vendor.name', read_only=True)
    
    def __init__(self, *args, **kwargs):
        product = kwargs.pop('product', None)
        vendor = kwargs.pop('vendor', None)
        super().__init__(*args, **kwargs)
        self.product = product
        self.vendor = vendor
    
    class Meta:
        model = Price
        fields = ['id', 'price', 'vendorCode', 'vendorName']
    
    
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
    
        instance.product = self.product
        instance.vendor = self.vendor
        
        instance.save()
        
        return instance
    

class PatchPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = ['id', 'price']


class ProductSerializer(serializers.ModelSerializer):
    dimension = serializers.DictField(write_only=True)
    productImage = serializers.CharField(required=False)
    providedVendorInfo = PriceSerializer(many=True, read_only=True, source='prices')
    
    def __init__(self, *args, **kwargs):
        legal_entity = kwargs.pop('legal_entity', None)
        super().__init__(*args, **kwargs)
        self.legal_entity = legal_entity
    
    class Meta:
        model = Product
        fields = [
            'id', 
            'name', 
            'description', 
            'SKU', 
            'brand', 
            'code', 
            'category', 
            'weight', 
            'dimension', 
            'color', 
            'material', 
            'productImage',
            'providedVendorInfo'
        ]
    
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['dimension'] = {
            'width': instance.width,
            'height': instance.height,
            'length': instance.length,
        }
        ret['productImage'] = ('http://localhost:8000' + instance.image.url) if instance.image else None
        return ret
        
    def create(self, validated_data):
        dimension = validated_data.pop('dimension', None)
        productImage = validated_data.pop('productImage', None)
        
        instance = self.Meta.model(**validated_data)
        
        instance.legal_entity = self.legal_entity
        instance.width = dimension.get('width', 0)
        instance.length = dimension.get('length', 0)
        instance.height = dimension.get('height', 0)
        instance.image = base64_file(productImage, name=instance.code) if productImage else None
        
        instance.save()
        
        return instance


class ContactSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        vendor = kwargs.pop('vendor', None)
        super().__init__(*args, **kwargs)
        self.vendor = vendor
    
    class Meta:
        model = Contact
        fields = ['id', 'name', 'phone', 'position']
        
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.vendor = self.vendor
        instance.save()
        
        return instance


class VendorSerializer(serializers.ModelSerializer):
    businessName = serializers.CharField(source='name')
    businessNumber = serializers.CharField(source='business_num')
    vendorImage = serializers.CharField(write_only=True)
    contacts = ContactSerializer(many=True, read_only=True)
    
    def __init__(self, *args, **kwargs):
        legal_entity = kwargs.pop('legal_entity', None)
        super().__init__(*args, **kwargs)
        self.legal_entity = legal_entity
    
    class Meta:
        model = Vendor
        fields = ['id', 'businessName', 'code', 'description', 'businessNumber', 'vendorImage', 'contacts']
    
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['vendorImage'] = ('http://localhost:8000' + instance.image.url) if instance.image else None
        
        return ret
        
    def create(self, validated_data):
        vendorImage = validated_data.pop('vendorImage', None)
        
        instance = self.Meta.model(**validated_data)
        
        instance.legal_entity = self.legal_entity
        instance.image = base64_file(vendorImage, name=instance.code)
        
        instance.save()
        
        return instance


class ProjectSerializer(serializers.ModelSerializer):
    isDefault = serializers.BooleanField(source='is_default', required=False)
    purchaseAllowance = serializers.DecimalField(source='purchase_allowance', max_digits=10, decimal_places=2)
    currentPurchase = serializers.DecimalField(source='current_purchase', max_digits=10, decimal_places=2, read_only=True)
    purchaseCount = serializers.IntegerField(source='purchase_count', read_only=True)
    
    def __init__(self, *args, **kwargs):
        legal_entity = kwargs.pop('legal_entity', None)
        super().__init__(*args, **kwargs)
        self.legal_entity = legal_entity
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'code', 'label', 'isDefault', 'purchaseAllowance', 'currentPurchase', 'purchaseCount']


    def create(self, validated_data):
        count = self.legal_entity.projects.count()
        
        if count == 0:
            validated_data['is_default'] = True
            
        instance = self.Meta.model(**validated_data)
        instance.legal_entity = self.legal_entity
        instance.save()
        
        return instance


class PatchProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'label']


class ProductPurchaseRequisitionSerializer(serializers.ModelSerializer):
    code = serializers.CharField(source='product.code')
    vendorCode = serializers.CharField(source='vendor.code')
    vendorName = serializers.CharField(source='vendor.name', read_only=True)
    price = serializers.DecimalField(source='vendor_price', max_digits=10, decimal_places=2, read_only=True)
    
    def __init__(self, *args, **kwargs):
        purchase_requisition = kwargs.pop('purchase_requisition', None)
        super().__init__(*args, **kwargs)
        self.purchase_requisition = purchase_requisition
    
    class Meta:
        model = ProductPurchaseRequisition
        fields = ['id', 'code', 'quantity', 'vendorCode', 'vendorName', 'price']
        
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['price'] = Price.objects.get(product=instance.product, vendor=instance.vendor).price
        
        return ret
    
    def create(self, validated_data):
        productCode = validated_data.pop('product', None).get('code', None)
        vendorCode = validated_data.pop('vendor', None).get('code', None)
        
        product = Product.objects.get(code=productCode)
        vendor = Vendor.objects.get(code=vendorCode)
        
        instance = self.Meta.model(**validated_data)
        instance.purchase_requisition = self.purchase_requisition
        instance.product = product
        instance.vendor = vendor
        instance.save()
        
        return instance


class PurchaseRequisitionSerializer(serializers.ModelSerializer):
    dueDate = serializers.CharField(source='due_date')
    targetDate = serializers.CharField(source='target_date')
    purchaseName = serializers.CharField(source='name')
    projectCode = serializers.CharField(source='project.code', read_only=True)
    requester = serializers.CharField(source='requester.username', read_only=True)
    products = ProductPurchaseRequisitionSerializer(many=True, source='product_purchase_requisitions', read_only=True)
    isApproved = serializers.BooleanField(source='is_approved', read_only=True)
    isRejected = serializers.BooleanField(source='is_rejected', read_only=True)
    rejectedComment = serializers.CharField(source='rejected_comment', read_only=True)
    
    def __init__(self, *args, **kwargs):
        legal_entity = kwargs.pop('legal_entity', None)
        user = kwargs.pop('user', None)
        project = kwargs.pop('project', None)
        super().__init__(*args, **kwargs)
        self.legal_entity = legal_entity
        self.user = user
        self.project = project
    
    class Meta:
        model = PurchaseRequisition
        fields = ['id', 'purchaseName', 'priority', 'projectCode', 'requester', 'targetDate', 'dueDate', 'status', 'products', 'isApproved', 'isRejected', 'rejectedComment']
    
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['dueDate'] = instance.due_date.strftime('%d-%m-%Y')
        ret['targetDate'] = instance.target_date.strftime('%d-%m-%Y')
        ret['commentCount'] = instance.total_comment
        
        return ret 
        
    def create(self, validated_data):
        target_date = validated_data.pop('target_date', None)
        target_date = datetime.strptime(target_date, '%d-%m-%Y')
        
        due_date = validated_data.pop('due_date', None)
        due_date = datetime.strptime(due_date, '%d-%m-%Y')
        
        instance = self.Meta.model(**validated_data)
        instance.legal_entity = self.legal_entity
        instance.requester = self.user
        instance.project = self.project
        instance.target_date = target_date
        instance.due_date = due_date
        instance.save()
        
        return instance


class SetStatusPurchaseRequisitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseRequisition
        fields = ['id', 'status']


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    createdDate = serializers.DateTimeField(source='created_at', read_only=True)
    updatedDate = serializers.DateTimeField(source='updated_at', read_only=True)
    isUpdated = serializers.BooleanField(source='is_updated', read_only=True)
    
    def __init__(self, *args, **kwargs):
        purchase_requisition = kwargs.pop('purchase_requisition', None)
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        self.purchase_requisition = purchase_requisition
        self.user = user
    
    class Meta:
        model = Comment
        fields = ['id', 'username', 'content', 'isUpdated', 'createdDate', 'updatedDate']
    
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['createdDate'] = instance.created_at.strftime('%d-%m-%Y %H:%M')
        ret['updatedDate'] = instance.updated_at.strftime('%d-%m-%Y %H:%M') if instance.updated_at else None
        
        return ret
        
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.purchase_requisition = self.purchase_requisition
        instance.user = self.user
        instance.save()
        
        return instance