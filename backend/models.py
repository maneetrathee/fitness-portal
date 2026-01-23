from sqlalchemy import Column, Integer, String, ForeignKey  # Added ForeignKey
from sqlalchemy.orm import relationship  # Added this line
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))

    # This links the User to their Workouts
    workouts = relationship("Workout", back_populates="owner")

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    exercise_type = Column(String(100))
    duration_minutes = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id")) # Link to User table

    # This links the Workout back to the User
    owner = relationship("User", back_populates="workouts")