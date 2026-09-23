import os
from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import User

router = APIRouter(prefix="/auth")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-development")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


def create_token(user: User) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_MINUTES)
    return jwt.encode({"sub": str(user.id), "exp": expires}, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def authenticate(db: Session, email: str, password: str) -> User | None:
    user = db.scalar(select(User).where(User.email == email.lower().strip()))
    if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return None
    return user


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    if len(payload.name.strip()) < 3 or len(payload.password) < 6 or "@" not in email:
        raise HTTPException(status_code=422, detail="Please provide a valid name, email, and password.")
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="A user with this email already exists.")

    user = User(
        name=payload.name.strip(),
        email=email,
        password_hash=bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "email": user.email}


@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate(db, form.username, form.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {"access_token": create_token(user), "token_type": "bearer"}


def get_current_user(token: str, db: Session) -> User:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = int(payload["sub"])
    except (JWTError, KeyError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    return user
