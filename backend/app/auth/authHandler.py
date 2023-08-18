import time as _time
from typing import Dict

import jwt as _jwt

from app.config import settings

def sign_jwt(email: str) -> Dict[str, str]:
    """
    Sign a JSON Web Token (JWT) with the provided email.

    Args:
        email (str): The email associated with the token.

    Returns:
        Dict[str, str]: A dictionary containing the access token.

    """
    payload = {
        "email": email,
        "expires": _time.time() + settings.ACCESS_TOKEN_EXPIRES_IN
    }
    token = _jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHMS)
    
    return {"accessToken": token}

def decode_jwt(token: str) -> dict:
    """
    Decode a JSON Web Token (JWT) and return the decoded payload.

    Args:
        token (str): The JWT to be decoded.

    Returns:
        dict: The decoded JWT payload if valid and not expired, otherwise None.

    """
    try:
        decoded_token = _jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHMS])
        return decoded_token if decoded_token["expires"] >= _time.time() else None
    except:
        return {}
