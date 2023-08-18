from app.database import contact_collection

class Vendor():
    def create(self, vendor):
        return {
            "businessName": vendor["businessName"],
            "businessNumber": vendor["businessNumber"],
            "code": vendor["code"]
        }
        
    def vendorResponse(self, vendor):
        def contactExtract(contact):
            return {
                "name": contact["name"],
                "phone": contact["phone"],
                "position": contact["position"]
            }
            
        contacts = contact_collection.find({"vendorCode": vendor["code"]})
        
        return {
            "id": str(vendor["_id"]),
            "businessName": vendor["businessName"],
            "businessNumber": vendor["businessNumber"],
            "code": vendor["code"],
            "contacts": [contactExtract(contact) for contact in contacts] if contacts.count() > 0 else []
        }
        
    def vendorsResponse(self, vendors):
        return [self.vendorResponse(vendor) for vendor in vendors] if vendors.count() > 0 else []
        
    def addContact(self, contact, vendorCode):
        return {
            "name": contact["name"],
            "phone": contact["phone"],
            "position": contact["position"],
            "vendorCode": vendorCode,
        }
    
vendor = Vendor()