from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas, database
from .hashing import Hash

# This line creates the tables in MySQL automatically
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Dependency to get a DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "Backend & MySQL are connected!"}

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. NEW: Hash the password before creating the model
    hashed_password = Hash.bcrypt(user.password)
    
    # 2. Store the HASH, not the real password
    new_user = models.User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password 
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

from typing import List

@app.get("/users/", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users