from pydantic import BaseModel

class Vendor():
    class Create(BaseModel):
        businessName: str
        businessNumber: str
        code: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "businessName": "businessName",
                    "businessNumber": "businessNumber",
                    "code": "code"
                }
            }
            
    class AddContact(BaseModel):
        name: str
        phone: str
        position: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "name": "johndoe",
                    "phone": "phone",
                    "position": "position"
                }
            }