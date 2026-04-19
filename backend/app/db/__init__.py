import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("DB_URL")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URL or not DB_NAME:
    raise ValueError("DB_URL and DB_NAME must be set in .env")

client = MongoClient(MONGO_URL)
client.admin.command("ping")

db = client[DB_NAME]

def get_db():
    return db

def close_client():
    client.close()
