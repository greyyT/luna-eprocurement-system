from fastapi import APIRouter, Depends, Path, Body
from fastapi.responses import JSONResponse

import app.schema as schema
from app.database import (
    entity_collection,
    price_collection,
    project_collection
)
from app.auth import JWTBearer

router = APIRouter()

@router.patch('/api/product/{legalEntityCode}/{productCode}/{vendorCode}/{price}', dependencies=[Depends(JWTBearer())], tags=['product'])
def update_price(
    legalEntityCode: str = Path(...),
    productCode: str = Path(...),
    vendorCode: str = Path(...),
    price: float = Path(...)
):
    entity = entity_collection.find_one({"legalEntityCode": legalEntityCode})
    
    if not entity:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    
    price = price_collection.update_one(
        {"productCode": productCode, "vendorCode": vendorCode},
        {"$set": {
            "price": price
        }}   
    )
    
    if price.matched_count == 0:
        return JSONResponse(status_code=404, content={"message": "Product not found"})
    elif price.modified_count == 0:
        return JSONResponse(status_code=500, content={"message": "Error updating price"})
    
    return JSONResponse(status_code=200, content={"message": "Price updated successfully"})

@router.patch('/api/project/{projectCode}', dependencies=[Depends(JWTBearer())], tags=['project'])
def update_project_name(req: schema.Project.PatchName = Body(...), projectCode: str = Path(...)):
    project = project_collection.update_one(
        {"code": projectCode},
        {"$set": {
            "name": req.name
        }}
    )
    
    if project.matched_count == 0:
        return JSONResponse(status_code=404, content={"message": "Project not found"})
    elif project.modified_count == 0:
        return JSONResponse(status_code=500, content={"message": "Error updating project"})
    
    return JSONResponse(status_code=200, content={"message": "Project updated successfully"})