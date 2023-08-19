import pymongo
from pymongo import mongo_client
from app.config import settings

client = mongo_client.MongoClient(settings.DATABASE_URI)
print("Connected to MongoDB...")

db = client[settings.MONGO_INITDB_DATABASE]

user_collection = db["User"]
user_collection.create_index("email", unique=True)

entity_collection = db["LegalEntity"]
entity_collection.create_index("code", unique=True)

department_collection = db["Department"]
department_collection.create_index("code", unique=True)

team_collection = db["Team"]
team_collection.create_index("code", unique=True)

product_collection = db["Product"]
product_collection.create_index("code", unique=True)

vendor_collection = db["Vendor"]
vendor_collection.create_index("code", unique=True)

price_collection = db["Price"]

contact_collection = db["Contact"]

project_collection = db["Project"]
project_collection.create_index("code", unique=True)