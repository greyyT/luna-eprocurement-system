from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse

import app.serializers as serializer
from app.database import user_collection
from app.auth import sign_jwt
import app.schema as schema

from app.services import verify_password

router = APIRouter()

@router.post('/auth/register', tags=['auth'])
def register(
    req: schema.User.Create = Body(...)
):
    user = user_collection.find_one({"email": req.email})
    
    if user:
        return JSONResponse(content={"message": "Email already registered"}, status_code=400)
    
    new_user = user_collection.insert_one(serializer.user.create(req))
    
    if not new_user:
        return JSONResponse(content={"message": "Something went wrong"}, status_code=500)
    
    return JSONResponse(content={"message": "User created successfully"}, status_code=200)

@router.post('/auth/login', tags=['auth'])
async def login(
    req: schema.User.Login = Body(...)
):
    user = user_collection.find_one({"email": req.email})
    
    if not user:
        return JSONResponse(content={"message": "Invalid username"}, status_code=400)
    
    verify = verify_password(req.password, user['password'])
    
    if not verify:
        return JSONResponse(content={"message": "Invalid password"}, status_code=400)
    
    return sign_jwt(user['email'])
