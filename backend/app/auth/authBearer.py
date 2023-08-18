import fastapi as _fastapi
from fastapi.security import HTTPBearer as _HTTPBearer, HTTPAuthorizationCredentials as _HTTPAuthorizationCredentials

from .authHandler import decode_jwt

class JWTBearer(_HTTPBearer):
    """
    Custom JWTBearer class that extends HTTPBearer.

    This class is responsible for validating and authenticating JWT tokens in the authorization header.

    Args:
        auto_error (bool, optional): If True, raise an HTTPException when token verification fails. Defaults to True.
    """

    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: _fastapi.Request):
        """
        Validate and authenticate the JWT token in the authorization header.

        Args:
            request (_fastapi.Request): The incoming request object.

        Returns:
            str: The validated JWT token.

        Raises:
            _fastapi.HTTPException: If the token is missing, has an invalid scheme, or fails verification.
        """

        credentials: _HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)

        if credentials:
            if not credentials.scheme == "Bearer":
                raise _fastapi.HTTPException(
                    status_code=403,
                    detail="Authorization scheme must be Bearer",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            if not self.verify_jwt(credentials.credentials):
                raise _fastapi.HTTPException(
                    status_code=403,
                    detail="Invalid token or expired credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return credentials.credentials
        else:
            raise _fastapi.HTTPException(
                status_code=403,
                detail="Invalid authorization credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

    def verify_jwt(self, token: str) -> bool:
        """
        Verify the JWT token by decoding and checking its validity.

        Args:
            token (str): The JWT token to verify.

        Returns:
            bool: True if the token is valid, False otherwise.
        """
        is_token_valid: bool = False

        try:
            payload = decode_jwt(token)
        except:
            payload = None

        if payload:
            is_token_valid = True

        return is_token_valid
