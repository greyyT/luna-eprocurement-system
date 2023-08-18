from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from passlib.hash import bcrypt
import jwt

from app.database import user_collection
from app.auth import JWTBearer, decode_jwt
import app.schema as schema

def handle_create_user(req: schema.User.Create):
    user = user_collection.insert_one({
        "email": req.email,
        "username": req.username,
        "password": bcrypt.hash(req.password),
        "role": None,
        "legalEntityCode": None,
        "departmentCode": None,
        "teamCode": None
    })
    
    return user

def verify_password(password: str, hashed_password: str):
    return bcrypt.verify(password, hashed_password)

async def get_email_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(JWTBearer())
) -> str:
    """Get the email address from the JWT token

    Args:
        credentials (HTTPAuthorizationCredentials): JWT token

    Returns:
        str: email address
    """
    try:
        token = credentials
        payload = decode_jwt(token)
        email = payload.get('email')  # Extract the email from the payload
        if email:
            return email
        else:
            raise HTTPException(status_code=401, detail="Invalid token")
        
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")