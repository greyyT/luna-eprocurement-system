from app.database import department_collection, team_collection

class Entity():
    def create(self, entity):
        return {
            "legalEntityCode": entity["code"],
            "businessNum": entity["name"]
        }
        
    def createDepartment(self, department):
        return {
            "code": department["departmentCode"],
            "name": department["departmentName"],
            "legalEntityCode": department["legalEntityCode"]
        }
        
    def createTeam(self, team):
        return {
            "code": team["teamCode"],
            "name": team["teamName"],
            "departmentCode": team["departmentCode"]
        }
        
    def usersReponse(self, users):
        def userExtract(user):
            department = department_collection.find_one({"code": user["departmentCode"]})
            team = team_collection.find_one({"code": user["teamCode"]})
            
            return {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "role": user["role"],
                "legalEntityCode": user["legalEntityCode"],
                "departmentCode": department["code"] if department else None,
                "departmentName": department["name"] if department else None,
                "teamCode": team["code"] if team else None,
                "teamName": team["name"] if team else None,
            }
            
        return [userExtract(user) for user in users]
    
    def entityInfoResponse(self, entity):
        def departmentExtract(department):
            def teamExtract(team):
                return {
                    "teamCode": team["code"],
                    "teamName": team["name"]
                }
                
            teams = team_collection.find({"departmentCode": department["code"]})
                
            return {
                "departmentCode": department["code"],
                "departmentName": department["name"],
                "teams": [teamExtract(team) for team in teams] if teams.count() > 0 else []
            }
            
        departments = department_collection.find({"legalEntityCode": entity["legalEntityCode"]})
        
        return [{
            "id": str(entity["_id"]),
            "code": entity["legalEntityCode"],
            "name": entity["businessNum"],
            "departments": [departmentExtract(department) for department in departments] if departments.count() > 0 else []
        }]
    
entity = Entity()