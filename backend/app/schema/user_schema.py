from pydantic import BaseModel

class User():
    class Create(BaseModel):
        email: str
        username: str
        password: str
        
        def __getitem__(self, key):
            return getattr(self, key)
        
        class Config():
            json_schema_extra = {
                "example": {
                    "email": "johndoe@gmail.com",
                    "username": "johndoe",
                    "password": "password"
                }
            }
            
    class Login(BaseModel):
        email: str
        password: str
        
        class Config():
            json_schema_extra = {
                "example": {
                    "email": "johndoe@gmail.com",
                    "password": "password"
                }
            }
            
    class SetRole(BaseModel):
        userEmail: str
        role: str
        
        class Config():
            json_schema_extra = {
                "example": {
                    "userEmail": "johndoe@gmail.com",
                    "role": "ADMIN"
                }
            }