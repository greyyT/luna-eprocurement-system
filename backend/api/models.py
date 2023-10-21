from django.db import models
import uuid


class LegalEntity(models.Model):
    # Represents a legal entity or company in the system.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    legal_entity_code = models.CharField(max_length=20, unique=True, db_index=True)
    business_num = models.CharField(max_length=200)
    
    def __str__(self):
        """String representation of a LegalEntity."""
        return f"{self.business_num} ({self.legal_entity_code})"


class Department(models.Model):
    # Represents a department within a legal entity.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    legal_entity = models.ForeignKey(LegalEntity, on_delete=models.CASCADE, related_name='departments', db_index=True)
    
    def __str__(self):
        """String representation of a Department."""
        return self.name


class Team(models.Model):
    # Represents a team within a department.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='teams', db_index=True)
    
    def __str__(self):
        """String representation of a Team."""
        return self.name


class Role(models.Model):
    # Represents a user role within a legal entity.
    ROLES = [
        ("ADMINISTRATOR", "Administrator"),
        ("MANAGER", "Manager"),
        ("MEMBER", "Member"),
        ("VIEWER", "Viewer"),
        ("SUPERVISOR", "Supervisor"),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=15, choices=ROLES)
    legal_entity = models.ForeignKey(LegalEntity, on_delete=models.CASCADE, related_name='roles', db_index=True)
    approve = models.BooleanField(default=True)
    reject = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('role', 'legal_entity')
    
    def __str__(self):
        """String representation of a Role."""
        return f"{self.role} ({self.legal_entity.legal_entity_code})"


class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    SKU = models.CharField(max_length=200)
    brand = models.CharField(max_length=200)
    code = models.CharField(max_length=200, unique=True, db_index=True)
    category = models.CharField(max_length=200)
    weight = models.CharField(max_length=5)
    width = models.CharField(max_length=5)
    height = models.CharField(max_length=5)
    length = models.CharField(max_length=5)
    color = models.CharField(max_length=200)
    material = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/products', null=True, blank=True, default=None)
    legal_entity = models.ForeignKey(LegalEntity, on_delete=models.CASCADE, related_name='products', db_index=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class Vendor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=200, unique=True, db_index=True)
    description = models.TextField(default=None, null=True, blank=True)
    business_num = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/vendors')
    legal_entity = models.ForeignKey(LegalEntity, on_delete=models.CASCADE, related_name='vendors', db_index=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class Price(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='prices', db_index=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='prices', db_index=True)
    
    class Meta:
        unique_together = ('product', 'vendor')
    
    def __str__(self):
        return f"{self.product.name} ({self.vendor.name})"


class Contact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='contacts', db_index=True)
    
    def __str__(self):
        return f"{self.name} ({self.vendor.name})"


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=200, unique=True, db_index=True)
    label = models.CharField(max_length=200)
    is_default = models.BooleanField(default=False)
    purchase_allowance = models.DecimalField(max_digits=10, decimal_places=2)
    current_purchase = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    purchase_count = models.IntegerField(default=0)
    legal_entity = models.ForeignKey(LegalEntity, on_delete=models.CASCADE, related_name='projects', db_index=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class PurchaseRequisition(models.Model):
    priority_choices = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ]
    
    status_choices = [
        ('DRAFT', 'Draft'),
        ('READY', 'Ready'),
        ('WAITING_TO_APPROVAL', 'Waiting to Approval'),
        ('TO_DO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('ON_HOLD', 'On Hold'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    priority = models.CharField(max_length=10, choices=priority_choices)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='purchase_requisitions', db_index=True)
    requester = models.ForeignKey('User', on_delete=models.PROTECT, related_name='purchase_requisitions', db_index=True)
    legal_entity = models.ForeignKey(LegalEntity, on_delete=models.CASCADE, related_name='purchase_requisitions', db_index=True)
    target_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=status_choices, default='DRAFT')
    is_approved = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)
    rejected_comment = models.TextField(null=True, blank=True, default=None)
    
    def __str__(self):
        return f"{self.name} ({self.project.name})"
    
    @property
    def total_price(self):
        return sum([product_purchase_requisition.price for product_purchase_requisition in self.product_purchase_requisitions.all()])
    
    @property
    def total_comment(self):
        return self.comments.count()


class ProductPurchaseRequisition(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quantity = models.IntegerField()
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='purchase_requisitions')
    vendor = models.ForeignKey(Vendor, on_delete=models.PROTECT, related_name='product_purchase_requisitions') 
    purchase_requisition = models.ForeignKey(PurchaseRequisition, on_delete=models.CASCADE, related_name='product_purchase_requisitions')
    
    class Meta:
        unique_together = ('product', 'purchase_requisition')
        
    @property
    def price(self):
        return self.quantity * self.product.prices.get(vendor=self.vendor).price


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField()
    purchase_requisition = models.ForeignKey(PurchaseRequisition, on_delete=models.CASCADE, related_name='comments', db_index=True)
    user = models.ForeignKey('User', on_delete=models.PROTECT, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_updated = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} ({self.purchase_requisition.name})"


class User(models.Model):
    # Represents user accounts in the system.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=200, unique=True, db_index=True)
    password = models.CharField(max_length=200)
    legal_entity = models.ForeignKey(LegalEntity, null=True, blank=True, on_delete=models.SET_NULL, related_name='users', db_index=True)
    department = models.ForeignKey(Department, null=True, blank=True, on_delete=models.SET_NULL)
    team = models.ForeignKey(Team, null=True, blank=True, on_delete=models.SET_NULL)
    role = models.ForeignKey(Role, null=True, blank=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        """String representation of a User."""
        return self.email
