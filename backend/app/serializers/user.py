from passlib.hash import bcrypt

class User():
    def create(self, user):
        return {
            "email": user["email"],
            "username": user["username"],
            "password": bcrypt.hash(user["password"]),
            "role": None,
            "legalEntityCode": None,
            "departmentCode": None,
            "teamCode": None
        }
        
    def userInfoResponse(self, user) -> dict:
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "username": user["username"],
            "role": user["role"],
            "legalEntityCode": user["legalEntityCode"],
            "departmentCode": user["departmentCode"],
            "teamCode": user["teamCode"],
        }

user = User()