from fastapi import APIRouter

router = APIRouter(
    prefix="/api",
    tags=["System"]
)


@router.get("/system")
def system_info():
    """
    Returns information about the MetricMind X system.
    """

    return {
        "project": "MetricMind X",
        "version": "1.0.0",
        "status": "Running",
        "engine": "LangGraph",
        "semantic_layer": "Enabled",
        "dashboard": "Enabled",
        "memory": "Enabled",
        "storage": "Enabled"
    }