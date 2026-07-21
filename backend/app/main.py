from fastapi import FastAPI

from app.api.upload import router as upload_router
from app.api.cleaning import router as cleaning_router

app = FastAPI(
    title="MetricMind X API",
    version="1.0.0"
)

app.include_router(upload_router)
app.include_router(cleaning_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to MetricMind X 🚀"
    }