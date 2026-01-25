from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas, database
from .hashing import Hash
from fastapi.middleware.cors import CORSMiddleware
from .auth import get_current_user
from .database import engine, SessionLocal, get_db

# This line creates the tables in MySQL automatically
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# This allows your Frontend (port 5173) to talk to your Backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you'd replace "*" with your actual URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

from fastapi.security import OAuth2PasswordRequestForm
from .hashing import Hash
from .auth import create_access_token

@app.post("/login")
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Find user by username
    user = db.query(models.User).filter(models.User.username == request.username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Invalid Credentials")
    
    # 2. Check if password is correct
    if not Hash.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=404, detail="Incorrect password")
    
    # 3. Generate Token
    access_token = create_access_token(data={"sub": user.username})
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/workouts/", response_model=schemas.WorkoutResponse)
def create_workout(
    workout: schemas.WorkoutCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # The Gatekeeper is now active!
):
    new_workout = models.Workout(
        exercise_type=workout.exercise_type,
        duration_minutes=workout.duration_minutes,
        user_id=current_user.id # Use the ID from the token!
    )
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)
    return new_workout

@app.get("/workouts/me", response_model=List[schemas.WorkoutResponse])
def get_my_workouts(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # This query says: "Find workouts where the user_id is the ID of the logged-in person"
    return db.query(models.Workout).filter(models.Workout.user_id == current_user.id).all()

@app.delete("/workouts/{workout_id}")
def delete_workout(
    workout_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    workout = db.query(models.Workout).filter(models.Workout.id == workout_id, models.Workout.user_id == current_user.id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(workout)
    db.commit()
    return {"message": "Successfully deleted"}