from pydantic import BaseModel

class Team():
    class Create(BaseModel):
        teamCode: str
        teamName: str
        departmentCode: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "teamCode": "code",
                    "teamName": "name",
                    "departmentCode": "code"
                }
            }
            
    class Set(BaseModel):
        teamCode: str
        userEmail: str
        
        class Config():
            json_schema_extra = {
                "example": {
                    "teamCode": "code",
                    "userEmail": "johndoe@gmail.com"
                }
            }    