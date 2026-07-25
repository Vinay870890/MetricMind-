from pathlib import Path

from fastapi import APIRouter

from app.analytics.analyzer import analyze
from app.schemas.analytics import (
    AnalyticsRequest,
    AnalyticsResponse,
)

router = APIRouter(
    prefix="/api",
    tags=["Business Analytics"]
)


@router.post(
    "/analyze",
    response_model=AnalyticsResponse
)
def analyze_dataset(request: AnalyticsRequest):
    """
    Perform grouped business analytics.
    """

    uploads_folder = Path("uploads")

    csv_files = list(
        uploads_folder.glob("*.csv")
    )

    if not csv_files:
        return {
            "dataset": "",
            "metric": request.metric,
            "group_by": request.group_by,
            "records": []
        }

    latest_file = max(
        csv_files,
        key=lambda file: file.stat().st_mtime
    )

    return analyze(
        str(latest_file),
        request.metric,
        request.group_by,
        request.top
    )
