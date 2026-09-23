from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import hospitals, chat

app = FastAPI(
    title="MediConnect Backend API",
    description="API for the Hospital Management System, featuring Overpass API integration and AI Medical Chatbot.",
    version="1.0.0"
)

# CORS configuration to allow frontend (localhost:5173) to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(hospitals.router, prefix="/api/hospitals", tags=["Hospitals"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Chatbot"])

@app.get("/")
async def root():
    return {"message": "Welcome to MediConnect API. Visit /docs for documentation."}
