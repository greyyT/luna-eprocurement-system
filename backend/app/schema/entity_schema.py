from pydantic import BaseModel

class Entity():
    class Create(BaseModel):
        name: str
        code: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "name": "name",
                    "code": "code"
                }
            }
            
    class Join(BaseModel):
        legalEntityCode: str
        
        class Config():
            json_schema_extra = {
                "example": {
                    "legalEntityCode": "code"
                }
            }