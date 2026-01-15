from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas, database

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
    # Create a new user object
    db_user = models.User(
        username=user.username, 
        email=user.email, 
        hashed_password=user.password # We will add hashing later!
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
from typing import List

@app.get("/users/", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users