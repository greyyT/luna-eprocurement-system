from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from passlib.hash import sha256_crypt
import jwt

from app.auth import JWTBearer, decode_jwt

def verify_password(password: str, hashed_password: str):
    return sha256_crypt.verify(password, hashed_password)

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