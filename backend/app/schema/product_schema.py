from pydantic import BaseModel

class Dimension(BaseModel):
    width: str
    height: str
    length: str
    
    def __getitem__(self, key):
        return getattr(self, key)

    
class MediaFile(BaseModel):
    productImage: str
    videoLink: str
    
    def __getitem__(self, key):
        return getattr(self, key)

class Product():
    class Create(BaseModel):
        name: str
        description: str
        brand: str
        SKU: str
        code: str
        category: str
        weight: str
        dimension: Dimension
        color: str
        material: str
        mediaFile: MediaFile
        legalEntityCode: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "name": "name",
                    "description": "description",
                    "brand": "brand",
                    "SKU": "SKU",
                    "code": "code",
                    "category": "category",
                    "weight": "weight",
                    "dimension": {
                        "width": "width",
                        "height": "height",
                        "length": "length"
                    },
                    "color": "color",
                    "material": "material",
                    "mediaFile": {
                        "productImage": "productImage",
                        "videoLink": "videoLink"
                    },
                    "legalEntityCode": "code"
                }
            }
            
    class AddPrice(BaseModel):
        productCode: str
        vendorCode: str
        price: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "productCode": "code",
                    "vendorCode": "code",
                    "price": "price"
                }
            }