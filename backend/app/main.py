from fastapi import FastAPI
from app.api.query import router as query_router
from app.api.chart import router as chart_router
from app.api.upload import router as upload_router
from app.api.cleaning import router as cleaning_router
from app.api.semantic import router as semantic_router
from app.api.metrics import router as metrics_router
from app.api.analytics import router as analytics_router
from app.api.ai_chart import router as ai_chart_router
from app.api.agent import router as agent_router
from app.api.langgraph_agent import router as langgraph_router
from app.api.memory import router as memory_router
app = FastAPI(
    title="MetricMind X API",
    version="1.0.0"
)

app.include_router(upload_router)
app.include_router(cleaning_router)
app.include_router(semantic_router)
app.include_router(metrics_router)
app.include_router(query_router)
app.include_router(analytics_router)
app.include_router(chart_router)
app.include_router(ai_chart_router)
app.include_router(agent_router)
app.include_router(langgraph_router)
app.include_router(memory_router)
@app.get("/")
def root():
    return {
        "message": "Welcome to MetricMind X 🚀"
    }