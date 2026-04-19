from fastapi import FastAPI
from app.api import router
from app.db import get_db, close_client

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
def startup_db():
    print("Starting database client...")
    get_db()

@app.on_event("shutdown")
def shutdown_db():
    print("Closing database client...")
    close_client()
