from fastapi import APIRouter, Depends, Path, Query
from fastapi.responses import JSONResponse

import app.serializers as serializer

from app.database import user_collection, entity_collection, product_collection, vendor_collection
from app.auth import JWTBearer
from app.services import get_email_from_token

router = APIRouter()

@router.get('/api/account', dependencies=[Depends(JWTBearer())], tags=['account'])
def get_user_info(email: str = Depends(get_email_from_token)):
    user = user_collection.find_one({"email": email})
    
    if not user:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    user_response = serializer.user.userInfoResponse(user)
    
    return user_response

@router.get('/api/entity/{legalEntityCode}/account', dependencies=[Depends(JWTBearer())], tags=['entity'])
def get_accounts_from_entity(legalEntityCode: str = Path(...)):
    users = user_collection.find({"legalEntityCode": legalEntityCode})
    
    if users.count() == 0:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    elif not users:
        return JSONResponse(status_code=500, content={"message": "Error getting users"})
    
    return {"data": serializer.entity.usersReponse(users)}

@router.get('/api/entity/{legalEntityCode}/info', dependencies=[Depends(JWTBearer())], tags=['entity'])
def get_entity_info(legalEntityCode: str = Path(...)):
    entity = entity_collection.find_one({"legalEntityCode": legalEntityCode})
    
    if not entity:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    
    return {"data": serializer.entity.entityInfoResponse(entity)}

@router.get('/api/product/{legalEntityCode}', dependencies=[Depends(JWTBearer())], tags=['product'])
def get_products(
    legalEntityCode: str = Path(...),
    page: int = Query(1),
    size: int = Query(3),
    search: str = Query(None)
):
    entity = entity_collection.find_one({"legalEntityCode": legalEntityCode})
    
    if not entity:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    
    if (search):
        products = product_collection.find({"legalEntityCode": legalEntityCode, "name": {"$regex": search, "$options": "i"}})
    else:
        products = product_collection.find({"legalEntityCode": legalEntityCode})
        
    if not products:
        return JSONResponse(status_code=500, content={"message": "Error getting products"})
        
    return {
        "data": serializer.product.productsResponse(products.skip((page - 1) * size).limit(size)),
        "currentPage": page,
        "size": size,
        "totalPages": products.count() / size if products.count() % size == 0 else (products.count() // size + 1),
        "totalElements": products.count(),
    }
    
@router.get('/api/product/{legalEntityCode}/{productCode}', dependencies=[Depends(JWTBearer())], tags=['product'])
def get_product_info(
    legalEntityCode: str = Path(...),
    productCode: str = Path(...)
):
    entity = entity_collection.find_one({"legalEntityCode": legalEntityCode})
    
    if not entity:
        return JSONResponse(status_code=404, content={"message": "Entity not found"})
    
    product = product_collection.find_one({"legalEntityCode": legalEntityCode, "code": productCode})
    
    if not product:
        return JSONResponse(status_code=404, content={"message": "Product not found"})
    
    return serializer.product.productResponse(product)

@router.get('/api/vendor', dependencies=[Depends(JWTBearer())], tags=['vendor'])
async def get_vendors(
    search: str = Query(None),
    page: int = Query(1),
    size: int = Query(3)
):
    if (search):
        vendors = vendor_collection.find({"name": {"$regex": search, "$options": "i"}})
    else:
        vendors = vendor_collection.find({})
        
    return {
        "data": serializer.vendor.vendorsResponse(vendors.skip((page - 1) * size).limit(size)),
        "currentPage": page,
        "size": size,
        "totalPages": vendors.count() / size if vendors.count() % size == 0 else (vendors.count() // size + 1),
        "totalElements": vendors.count(),
    }
    
@router.get('/api/vendor/{vendorCode}', dependencies=[Depends(JWTBearer())], tags=['vendor'])
def get_vendor_info(vendorCode: str = Path(...)):
    vendor = vendor_collection.find_one({"code": vendorCode})
    
    if not vendor:
        return JSONResponse(status_code=404, content={"message": "Vendor not found"})
    
    return serializer.vendor.vendorResponse(vendor)