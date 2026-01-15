from fastapi import FastAPI

# This creates the "App" instance
app = FastAPI()

# This is a "Route". When you go to the homepage, it triggers this function.
@app.get("/")
def home():
    return {"message": "Hello from the Fitness Portal!", "status": "Running"}
@app.get("/health-check")
def check_health():
    return {
        "status": "Healthy",
        "bpm": 72,
        "hydration": "Good"
    }