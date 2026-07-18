from fastapi import FastAPI

app = FastAPI(
    title="MetricMind API",
    description="Enterprise AI-Powered Semantic Business Intelligence Platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to MetricMind 🚀",
        "status": "Running",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }