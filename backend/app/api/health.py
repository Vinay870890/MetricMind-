from pathlib import Path

from fastapi import APIRouter

router = APIRouter(
    prefix="/api",
    tags=["Health"]
)


@router.get("/health")
def health_check():
    """
    Health check endpoint for MetricMind X.
    """

    dashboard_file = (
        Path(__file__).parent.parent
        / "data"
        / "dashboards.json"
    )

    dashboard_storage = (
        "ok"
        if dashboard_file.exists()
        else "missing"
    )

    return {
        "status": "healthy",
        "database": "ok",
        "dashboard_storage": dashboard_storage,
        "semantic_registry": "ok",
        "langgraph": "ok"
    }