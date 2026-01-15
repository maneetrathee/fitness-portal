from passlib.context import CryptContext

# This sets up the 'bcrypt' algorithm
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash:
    @staticmethod
    def bcrypt(password: str):
        # This function takes a plain password and returns a scrambled one
        return pwd_context.hash(password)

    @staticmethod
    def verify(plain_password, hashed_password):
        # We'll use this later to check if a login is correct
        return pwd_context.verify(plain_password, hashed_password)