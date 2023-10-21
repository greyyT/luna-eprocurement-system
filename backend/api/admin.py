from django.contrib import admin
from .models import User, LegalEntity, Role, Department, Product, Vendor, Price, Contact, Project, PurchaseRequisition

# Register your models here.
admin.site.register(User)
admin.site.register(LegalEntity)
admin.site.register(Department)
admin.site.register(Role)
admin.site.register(Product)
admin.site.register(Vendor)
admin.site.register(Price)
admin.site.register(Contact)
admin.site.register(Project)
admin.site.register(PurchaseRequisition)