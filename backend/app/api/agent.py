from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.agents.orchestrator import run_agents

router = APIRouter(
    prefix="/api",
    tags=["AI Agent"]
)


@router.post("/agent")
def agent(request: dict):
    """
    AI Multi-Agent endpoint.
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

    return run_agents(
        request["question"],
        str(latest_file)
    )