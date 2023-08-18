from fastapi import APIRouter, Depends, Path
from fastapi.responses import JSONResponse

from app.database import (
    entity_collection,
    price_collection
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