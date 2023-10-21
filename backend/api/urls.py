from django.urls import path
from .views import (
    get_user, 
    set_role,
    create_legal_entity, 
    join_legal_entity, 
    list_legal_entity_accounts, 
    get_legal_entity,
    delete_user_from_legal_entity,
    create_department,
    set_department,
    delete_department,
    create_team,
    set_team,
    list_or_update_role,
    create_and_list_product,
    delete_and_get_product,
    assign_price_to_product,
    update_price,
    delete_and_update_price,
    create_and_list_vendor,
    delete_and_get_vendor,
    create_contact_in_vendor,
    delete_contact,
    create_and_list_project,
    delete_and_update_project,
    mark_default_project,
    create_and_list_purchase_requisition,
    get_and_delete_purchase_requisition,
    set_purchase_requisition_status,
    approve_purchase_requisition,
    reject_purchase_requisition,
    post_and_list_comment_purchase_requisition,
    delete_and_update_comment_purchase_requisition
)

urlpatterns = [
    path('account', get_user),
    path('account/set-role', set_role),
    path('entity/create-entity', create_legal_entity),
    path('entity/join-entity', join_legal_entity),
    path('entity/account', list_legal_entity_accounts),
    path('entity/info', get_legal_entity),
    path('entity/account/<str:account_id>', delete_user_from_legal_entity),
    path('department', create_department),
    path('department/set-department', set_department),
    path('department/delete/<str:department_id>', delete_department),
    path('team', create_team),
    path('team/set-team', set_team),
    path('role', list_or_update_role),
    path('product', create_and_list_product),
    path('product/add-price', assign_price_to_product),
    path('product/update-price', update_price),
    path('product/delete-price/<str:price_id>', delete_and_update_price),
    path('product/<str:product_code>', delete_and_get_product),
    path('vendor', create_and_list_vendor),
    path('vendor/contact', create_contact_in_vendor),
    path('vendor/<str:vendor_code>', delete_and_get_vendor),
    path('vendor/contact/<str:contact_id>', delete_contact),
    path('project', create_and_list_project),
    path('project/<str:project_code>', delete_and_update_project),
    path('project/<str:project_code>/mark-default', mark_default_project),
    path('purchase-requisition', create_and_list_purchase_requisition),
    path('purchase-requisition/<str:purchase_requisition_id>', get_and_delete_purchase_requisition),
    path('purchase-requisition/<str:purchase_requisition_id>/set-status', set_purchase_requisition_status),
    path('purchase-requisition/<str:purchase_requisition_id>/approve', approve_purchase_requisition),
    path('purchase-requisition/<str:purchase_requisition_id>/reject', reject_purchase_requisition),
    path('purchase-requisition/<str:purchase_requisition_id>/comment', post_and_list_comment_purchase_requisition),
    path('purchase-requisition/<str:purchase_requisition_id>/comment/<str:comment_id>', delete_and_update_comment_purchase_requisition)
]