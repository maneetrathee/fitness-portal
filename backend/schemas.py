from pydantic import BaseModel, EmailStr

# This defines what the user sends TO the server (Sign up)
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# This defines what the server sends BACK to the user (Response)
class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True