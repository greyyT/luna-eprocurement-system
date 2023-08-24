from fastapi import APIRouter, Depends, Path
from fastapi.responses import JSONResponse

from app.database import (
    entity_collection,
    user_collection,
    department_collection,
    team_collection,
    product_collection,
    project_collection,
    price_collection
)
from app.auth import JWTBearer

router = APIRouter()

@router.delete('/api/department/{departmentCode}', dependencies=[Depends(JWTBearer())], tags=['department'])
def delete_department(departmentCode: str = Path(...)):
    department = department_collection.find_one({"code": departmentCode})
    
    if not department:
        return JSONResponse(status_code=404, content={"message": "Department not found"})
    
    user_collection.update_many(
        {"departmentCode": departmentCode},
        {"$set": {
            "departmentCode": None,
            "teamCode": None
        }}
    )
    
    team_collection.delete_many({"departmentCode": departmentCode})
    
    department_collection.delete_one({"code": departmentCode})
    
    return JSONResponse(status_code=200, content={"message": "Department deleted successfully"})

@router.delete('/api/project/{projectCode}', dependencies=[Depends(JWTBearer())], tags=['project'])
def delete_project(projectCode: str = Path(...)):
    project = project_collection.delete_one({"code": projectCode})
    
    if not project:
        return JSONResponse(status_code=500, content={"message": "Error deleting project"})
    
    return JSONResponse(status_code=200, content={"message": "Project deleted successfully"})

@router.delete('/api/{legalEntityCode}/{userEmail}', dependencies=[Depends(JWTBearer())], tags=['entity'])
def delete_user_from_entity(
    legalEntityCode: str = Path(...),
    userEmail: str = Path(...)
):
    entity = entity_collection.find_one({"legalEntityCode": legalEntityCode})
    
    if not entity:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    
    user = user_collection.find_one({"email": userEmail})
    
    if not user:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    if user["legalEntityCode"] != legalEntityCode:
        return JSONResponse(status_code=400, content={"message": "User does not belong to entity"})
    
    user = user_collection.update_one(
        {"email": userEmail}, 
        {"$set": {
            "legalEntityCode": None, 
            "role": None
        }}
    )
    
    return JSONResponse(status_code=200, content={"message": "User deleted from entity successfully"})

@router.delete('/api/product/{legalEntityCode}/{productCode}', dependencies=[Depends(JWTBearer())], tags=['product'])
def delete_product(legalEntityCode: str = Path(...), productCode: str = Path(...)):
    entity = entity_collection.find_one({"legalEntityCode": legalEntityCode})
    
    if not entity:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    
    price_collection.delete_many({"productCode": productCode})
    
    product = product_collection.delete_one({"legalEntityCode": legalEntityCode, "code": productCode})
    
    if not product:
        return JSONResponse(status_code=500, content={"message": "Error deleting product"})
    
    return JSONResponse(status_code=200, content={"message": "Product deleted successfully"})