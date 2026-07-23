from pathlib import Path

from fastapi import APIRouter

from app.nlq.parser import process_query
from app.schemas.query import QueryRequest, QueryResponse

router = APIRouter(
    prefix="/api",
    tags=["Natural Language Query"]
)


@router.post("/query", response_model=QueryResponse)
def ask_question(request: QueryRequest):
    """
    Ask business questions in natural language.
    """

    uploads_folder = Path("uploads")

    csv_files = list(uploads_folder.glob("*.csv"))

    if not csv_files:
        return {
            "question": request.question,
            "metric": "none",
            "value": "No dataset uploaded."
        }

    latest_file = max(
        csv_files,
        key=lambda file: file.stat().st_mtime
    )

    return process_query(
        request.question,
        str(latest_file)
    )