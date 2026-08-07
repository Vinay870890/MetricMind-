from pathlib import Path
import json

from fastapi import APIRouter

from app.memory.conversation import memory
from app.semantic.registry import SEMANTIC_REGISTRY

router = APIRouter(
    prefix="/api",
    tags=["System"]
)


def dashboard_count():
    """
    Count saved dashboards.
    """

    data_file = (
        Path(__file__).parent.parent
        / "data"
        / "dashboards.json"
    )

    if not data_file.exists():
        return 0

    try:
        with open(data_file, "r", encoding="utf-8") as f:
            content = f.read().strip()

            if not content:
                return 0

            return len(json.loads(content))

    except Exception:
        return 0


def memory_count():
    """
    Count conversation memory entries.
    """

    try:
        history = memory.load()

        if history is None:
            return 0

        return len(history)

    except Exception:
        return 0


def semantic_metric_count():
    """
    Count governed business metrics.
    """

    return len(SEMANTIC_REGISTRY)


def available_chart_count():
    """
    Number of supported chart types.
    """

    chart_types = [
        "bar",
        "horizontal_bar",
        "line",
        "pie",
        "donut",
        "area",
        "scatter",
        "table",
        "kpi"
    ]

    return len(chart_types)


@router.get("/stats")
def project_statistics():
    """
    Project statistics.
    """

    return {
        "status": "success",
        "saved_dashboards": dashboard_count(),
        "memory_entries": memory_count(),
        "semantic_metrics": semantic_metric_count(),
        "available_charts": available_chart_count()
    }