from app.database import price_collection, vendor_collection, product_collection

class Product():
    def create(self, product):
        return {
            "name": product["name"],
            "description": product["description"],
            "brand": product["brand"],
            "SKU": product["SKU"],
            "code": product["code"],
            "category": product["category"],
            "weight": product["weight"],
            "width": product["dimension"]["width"],
            "height": product["dimension"]["height"],
            "length": product["dimension"]["length"],
            "color": product["color"],
            "material": product["material"],
            "productImage": product["mediaFile"]["productImage"],
            "videoLink": product["mediaFile"]["videoLink"],
            "legalEntityCode": product["legalEntityCode"]
        }
        
    def productResponse(self, product):
        def get_price(price):
            vendor = vendor_collection.find_one({"code": price["vendorCode"]})
            
            return {
                "vendorCode": vendor["code"],
                "vendorName": vendor["businessName"],
                "price": price["price"]
            }
            
        prices = price_collection.find({"productCode": product["code"]})
        
        return {
            "id": str(product["_id"]),
            "name": product["name"],
            "description": product["description"],
            "brand": product["brand"],
            "SKU": product["SKU"],
            "code": product["code"],
            "category": product["category"],
            "weight": product["weight"],
            "dimension": {
                "width": product["width"],
                "height": product["height"],
                "length": product["length"]
            },
            "color": product["color"],
            "material": product["material"],
            "mediaFile": {
                "productImage": product["productImage"],
                "videoLink": product["videoLink"]
            },
            "providedVendorInfo": [get_price(price) for price in prices] if prices.count() > 0 else [],
            "legalEntityCode": product["legalEntityCode"]
        }
        
    def productsResponse(self, products):
        return [self.productResponse(product) for product in products] if products.count() > 0 else []
    
    def addPrice(self, price):
        return {
            "productCode": price["productCode"],
            "vendorCode": price["vendorCode"],
            "price": price["price"]
        }    
        
product = Product()