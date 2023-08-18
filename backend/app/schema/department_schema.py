from pydantic import BaseModel

class Department():
    class Create(BaseModel):
        departmentCode: str
        departmentName: str
        legalEntityCode: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "departmentCode": "code",
                    "departmentName": "name",
                    "legalEntityCode": "code"
                }
            }
            
    class Set(BaseModel):
        departmentCode: str
        userEmail: str
        
        class Config():
            json_schema_extra = {
                "example": {
                    "departmentCode": "code",
                    "userEmail": "johndoe@gmail.com"
                }
            }