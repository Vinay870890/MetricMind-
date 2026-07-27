from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.ai.parser import parse_question
from app.analytics.analyzer import analyze
from app.charts.generator import generate_chart

router = APIRouter(
    prefix="/api",
    tags=["AI Charts"]
)


@router.post("/ai-chart")
def ai_chart(question: dict):
    """
    Generate a chart directly from a natural-language question.
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

    parsed = parse_question(question["question"])

    if not parsed["metric"] or not parsed["group_by"]:
        raise HTTPException(
            status_code=400,
            detail="Unable to understand the question."
        )

    analysis = analyze(
        str(latest_file),
        parsed["metric"],
        parsed["group_by"],
        parsed["top"]
    )

    return generate_chart(analysis)