import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from models import User  # noqa: F401 - registers the model before create_all
from routers import auth, health, users

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app = FastAPI(
    title="MediSphere Backend API",
    description="Authentication and database API for MediSphere.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:5173", "https://guardianoftech.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(health.router, prefix="/api/v1", tags=["Health"])

@app.get("/")
async def root():
    return {"message": "Welcome to MediConnect API. Visit /docs for documentation."}
