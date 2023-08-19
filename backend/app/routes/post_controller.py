from fastapi import APIRouter, Body, Depends, Path
from fastapi.responses import JSONResponse

import app.schema as schema
import app.serializers as serializer
from app.database import (
    entity_collection, 
    user_collection, 
    department_collection,
    team_collection,
    product_collection,
    vendor_collection,
    price_collection,
    contact_collection,
    project_collection
)

from app.auth import JWTBearer
from app.services import (
    get_email_from_token
)

router = APIRouter()

@router.post('/api/entity/create-entity', dependencies=[Depends(JWTBearer())], tags=['entity'])
def create_entity(
    req: schema.Entity.Create = Body(...),
    email: str = Depends(get_email_from_token)
):
    entity = entity_collection.find_one({"legalEntityCode": req.code})
    
    if entity:
        return JSONResponse(status_code=400, content={"message": "Entity already exists"})
    
    entity = entity_collection.insert_one(serializer.entity.create(req))
    
    if not entity:
        return JSONResponse(status_code=500, content={"message": "Error creating entity"})
    
    user_collection.update_one(
        {"email": email}, 
        {"$set": {
            "legalEntityCode": req.code, 
            "role": "MANAGER"
        }}
    )
    
    return JSONResponse(status_code=200, content={"message": "Entity created successfully"})

@router.post('/api/entity/join-entity', dependencies=[Depends(JWTBearer())], tags=['entity'])
def join_entity(
    req: schema.Entity.Join = Body(...),
    email: str = Depends(get_email_from_token)
):
    entity = entity_collection.find_one({"legalEntityCode": req.legalEntityCode})
    
    if not entity:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    
    user_collection.update_one(
        {"email": email}, 
        {"$set": {
            "legalEntityCode": req.legalEntityCode, 
            "role": "MEMBER"
        }}
    )
    
    return JSONResponse(status_code=200, content={"message": "Entity joined successfully"})

@router.post('/api/department', dependencies=[Depends(JWTBearer())], tags=['department'])
def create_department(req: schema.Department.Create = Body(...)):
    entity = entity_collection.find_one({"legalEntityCode": req.legalEntityCode})
    
    if not entity:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    
    department = entity_collection.find_one({
        "legalEntityCode": req.legalEntityCode, 
        "code": req.departmentCode
    })
    
    if department:
        return JSONResponse(status_code=400, content={"message": "Department code has already been taken"})
    
    department = department_collection.insert_one(serializer.entity.createDepartment(req))
    
    if not department:
        return JSONResponse(status_code=500, content={"message": "Error creating department"})
    
    return JSONResponse(status_code=200, content={"message": "Department created successfully"})

@router.post('/api/department/set-department', dependencies=[Depends(JWTBearer())], tags=['department'])
def set_department(req: schema.Department.Set = Body(...)):
    department = department_collection.find_one({"code": req.departmentCode})
    
    if not department:
        return JSONResponse(status_code=404, content={"message": "Department not found"})
    
    user = user_collection.find_one({"email": req.userEmail})
    
    if not user:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    user_collection.update_one(
        {"email": req.userEmail}, 
        {"$set": {
            "departmentCode": req.departmentCode
        }}
    )
    
    return JSONResponse(status_code=200, content={"message": "Department set successfully"})

@router.post('/api/team', dependencies=[Depends(JWTBearer())], tags=['team'])
def create_team(req: schema.Team.Create = Body(...)):
    department = department_collection.find_one({"code": req.departmentCode})
    
    if not department:
        return JSONResponse(status_code=404, content={"message": "Department not found"})
    
    team = team_collection.find_one({
        "departmentCode": req.departmentCode,
        "code": req.teamCode
    })
    
    if team:
        return JSONResponse(status_code=400, content={"message": "Team code has already been taken"})
    
    team = team_collection.insert_one(serializer.entity.createTeam(req))
    
    if not team:
        return JSONResponse(status_code=500, content={"message": "Error creating team"})
    
    return JSONResponse(status_code=200, content={"message": "Team created successfully"})

@router.post('/api/team/set-team', dependencies=[Depends(JWTBearer())], tags=['team'])
def set_team(req: schema.Team.Set = Body(...)):
    team = team_collection.find_one({"code": req.teamCode})
    
    if not team:
        return JSONResponse(status_code=404, content={"message": "Team not found"})
    
    user = user_collection.find_one({"email": req.userEmail})
    
    if not user:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    user_collection.update_one(
        {"email": req.userEmail}, 
        {"$set": {
            "teamCode": req.teamCode
        }}
    )
    
    return JSONResponse(status_code=200, content={"message": "Team set successfully"})

@router.post('/api/account/set-role', dependencies=[Depends(JWTBearer())], tags=['account'])
def set_role(req: schema.User.SetRole = Body(...)):
    user = user_collection.find_one({"email": req.userEmail})
    
    if not user:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    user_collection.update_one(
        {"email": req.userEmail}, 
        {"$set": {
            "role": req.role
        }}
    )
    
    return JSONResponse(status_code=200, content={"message": "Role set successfully"})

@router.post('/api/product', dependencies=[Depends(JWTBearer())], tags=['product'])
def create_product(req: schema.Product.Create = Body(...)):
    entity = entity_collection.find_one({"legalEntityCode": req.legalEntityCode})
    
    if not entity:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    
    product = entity_collection.find_one({
        "legalEntityCode": req.legalEntityCode,
        "code": req.code
    })
    
    if product:
        return JSONResponse(status_code=400, content={"message": "Product code has already been taken"})
    
    product = product_collection.insert_one(serializer.product.create(req))
    
    if not product:
        return JSONResponse(status_code=500, content={"message": "Error creating product"})
        
    return JSONResponse(status_code=200, content={"message": "Product created successfully"})

@router.post('/api/product/assignToVendor', dependencies=[Depends(JWTBearer())], tags=['product'])
def assign_to_vendor(req: schema.Product.AddPrice = Body(...)):
    product = product_collection.find_one({"code": req.productCode})
    
    if not product:
        return JSONResponse(status_code=404, content={"message": "Product not found"})
    
    vendor = vendor_collection.find_one({"code": req.vendorCode})
    
    if not vendor:
        return JSONResponse(status_code=404, content={"message": "Vendor not found"})
    
    price = price_collection.find_one({
        "productCode": req.productCode,
        "vendorCode": req.vendorCode
    })
    
    if price:
        return JSONResponse(status_code=400, content={"message": "Product already assigned to vendor"})
    
    price = price_collection.insert_one(serializer.product.addPrice(req))
    
    if not price:
        return JSONResponse(status_code=500, content={"message": "Error assigning product to vendor"})
    
    return JSONResponse(status_code=200, content={"message": "Product assigned to vendor successfully"})

@router.post('/api/vendor', dependencies=[Depends(JWTBearer())], tags=['vendor'])
def create_vendor(req: schema.Vendor.Create = Body(...)):
    vendor = vendor_collection.find_one({"code": req.code})
    
    if vendor:
        return JSONResponse(status_code=400, content={"message": "Vendor code has already been taken"})
    
    vendor = vendor_collection.insert_one(serializer.vendor.create(req))
    
    if not vendor:
        return JSONResponse(status_code=500, content={"message": "Error creating vendor"})
    
    return JSONResponse(status_code=200, content={"message": "Vendor created successfully"})

@router.post('/api/vendor/{vendorCode}/addContact', dependencies=[Depends(JWTBearer())], tags=['vendor'])
def add_contact(req: schema.Vendor.AddContact = Body(...), vendorCode = Path(...)):
    vendor = vendor_collection.find_one({"code": vendorCode})
    
    if not vendor:
        return JSONResponse(status_code=404, content={"message": "Vendor not found"})
    
    contact = contact_collection.insert_one(serializer.vendor.addContact(req, vendorCode))
    
    if not contact:
        return JSONResponse(status_code=500, content={"message": "Error adding contact"})
    
    return JSONResponse(status_code=200, content={"message": "Contact added successfully"})

@router.post('/api/project', dependencies=[Depends(JWTBearer())], tags=['project'])
def create_project(req: schema.Project.Create = Body(...)):
    project = project_collection.insert_one(serializer.project.create(req))
    
    if not project:
        return JSONResponse(status_code=500, content={"message": "Error creating project"})
    
    return JSONResponse(status_code=200, content={"message": "Project created successfully"})

@router.post('/api/project/{projectCode}/markDefault', dependencies=[Depends(JWTBearer())], tags=['project'])
def mark_project_default(projectCode: str = Path(...)):
    project_collection.update_one(
        {"isDefault": True},
        {"$set": {
            "isDefault": False
        }}
    )
    
    default_project = project_collection.update_one(
        {"code": projectCode},
        {"$set": {
            "isDefault": True
        }}
    )
    
    if default_project.matched_count == 0:
        return JSONResponse(status_code=404, content={"message": "Project not found"})
    elif default_project.modified_count == 0:
        return JSONResponse(status_code=500, content={"message": "Error marking project default"})
    
    return JSONResponse(status_code=200, content={"message": "Project marked default successfully"})