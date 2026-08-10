from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.api.tags import tags_metadata

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
from app.api.dashboard import router as dashboard_router
from app.api.dashboard_filter import router as dashboard_filter_router
from app.api.system import router as system_router
from app.api.health import router as health_router
from app.api.stats import router as stats_router


app = FastAPI(
    title="MetricMind X",
    description="""
## AI-Powered Semantic Business Intelligence Platform

MetricMind X is an enterprise-grade BI platform that converts
natural language questions into governed business analytics.

### Features

- Semantic Metric Registry
- LangGraph Multi-Agent Workflow
- Business Analytics
- AI Dashboard Generation
- KPI Cards
- Executive Insights
- Dashboard Storage
- Conversation Memory
- Visualization Recommendation
- Export Ready Dashboard

### Workflow

Planner
→ Semantic Validator
→ Router
→ Analytics
→ Insight
→ Visualization
→ Response
""",
    version="1.0.0",
    contact={
        "name": "Vinay Balhara",
        "url": "https://github.com/Vinay870890"
    },
    license_info={
        "name": "MIT"
    },
    openapi_tags=tags_metadata
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dataset Pipeline
app.include_router(upload_router)
app.include_router(cleaning_router)
app.include_router(semantic_router)
app.include_router(metrics_router)

# Analytics
app.include_router(query_router)
app.include_router(analytics_router)
app.include_router(chart_router)
app.include_router(ai_chart_router)

# AI
app.include_router(agent_router)
app.include_router(langgraph_router)
app.include_router(memory_router)

# Dashboard

app.include_router(dashboard_router)
app.include_router(dashboard_filter_router)

# Monitoring
app.include_router(system_router)
app.include_router(health_router)
app.include_router(stats_router)


@app.get(
    "/",
    tags=["System"],
    summary="Root Endpoint",
    description="Welcome endpoint for MetricMind X."
)
def root():
    return {
        "message": "Welcome to MetricMind X 🚀",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }