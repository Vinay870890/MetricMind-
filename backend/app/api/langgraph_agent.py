from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.graph.workflow import graph
from app.memory.session_memory import memory

router = APIRouter(
    prefix="/api",
    tags=["LangGraph AI"]
)


@router.post("/langgraph")
def run_langgraph(request: dict):
    """
    Execute the LangGraph workflow.
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

    state = {
        "question": request["question"],
        "file_path": str(latest_file),
        "plan": {},
        "analysis": {},
        "chart": {},
        "response": {},
        "trace": []
    }

    result = graph.invoke(state)

    memory.add(
        request["question"],
        result["response"]
    )

    return result["response"]