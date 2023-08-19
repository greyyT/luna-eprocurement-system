class Project():
    def create(self, project):
        return {
            "name": project["name"],
            "label": project["projectCode"]["label"],
            "code": project["projectCode"]["code"],
            "purchaseAllowance": project["purchaseAllowance"],
            "isDefault": False,
            "legalEntityCode": project["legalEntityCode"]
        }
        
    def projectResponse(self, project):
        return {
            "id": str(project["_id"]),
            "name": project["name"],
            "projectCode": {
                "label": project["label"],
                "code": project["code"]
            },
            "purchaseAllowance": project["purchaseAllowance"],
            "isDefault": project["isDefault"],
            "legalEntityCode": project["legalEntityCode"]
        }
        
    def projectsResponse(self, projects):
        return [self.projectResponse(project) for project in projects] if projects.count() > 0 else []
        
project = Project()