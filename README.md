# Fitness Portal - Full Stack Application

A comprehensive fitness tracking system built with a decoupled architecture. This project serves as a 4th-year CSE capstone to demonstrate CRUD operations, relational database management, and API design.

## 🚀 Tech Stack

- **Backend:** FastAPI (Python)
- **Database:** MySQL
- **ORM:** SQLAlchemy
- **Schema Validation:** Pydantic
- **Frontend:** React (Coming Soon)

## 🛠️ Features Implemented

- [x] MySQL Database Connection with SQLAlchemy
- [x] User Registration API (POST /users/)
- [x] User Retrieval API (GET /users/)
- [x] Automatic API Documentation (Swagger UI)

## 📦 Project Structure

- `/backend`: FastAPI server, database models, and API logic.
- `/frontend`: React application (Initial setup pending).
- `/database`: SQL initialization scripts.

## ⚙️ Setup Instructions

1. **Clone the repo:** `git clone <your-repo-link>`
2. **Setup Virtual Environment:** `python3 -m venv venv && source venv/bin/activate`
3. **Install Dependencies:** `pip install fastapi sqlalchemy pymysql uvicorn`
4. **Run Server:** `python -m uvicorn backend.main:app --reload`
