from pydantic import BaseModel

class ProjectCode(BaseModel):
    label: str
    code: str
    
    def __getitem__(self, key):
        return getattr(self, key)
    
class Project():
    class Create(BaseModel):
        name: str
        projectCode: ProjectCode
        purchaseAllowance: str
        legalEntityCode: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "name": "name",
                    "projectCode": {
                        "label": "label",
                        "code": "code"
                    },
                    "purchaseAllowance": "purchaseAllowance",
                    "legalEntityCode": "code"
                }
            }
            
    class PatchName(BaseModel):
        name: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "name": "name"
                }
            }