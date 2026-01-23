from datetime import datetime, timedelta
from jose import JWTError, jwt

# Secret key to sign the tokens (Keep this secret!)
SECRET_KEY = "S3CR3T_K3Y_FOR_FITN3SS_APP"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    # Token expires in 30 minutes
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)