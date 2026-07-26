from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.analytics.analyzer import analyze
from app.charts.generator import generate_chart
from app.schemas.analytics import AnalyticsRequest
from app.schemas.chart import ChartResponse

router = APIRouter(
    prefix="/api",
    tags=["Chart Generator"]
)


@router.post("/chart", response_model=ChartResponse)
def create_chart(request: AnalyticsRequest):
    """
    Generate chart-ready JSON from analytics.
    """

    uploads_folder = Path("uploads")

    csv_files = list(uploads_folder.glob("*.csv"))

    if not csv_files:
        raise HTTPException(
            status_code=404,
            detail="No dataset uploaded."
        )

    latest_file = max(
        csv_files,
        key=lambda file: file.stat().st_mtime
    )

    analysis = analyze(
        str(latest_file),
        request.metric,
        request.group_by,
        request.top
    )

    return generate_chart(analysis)