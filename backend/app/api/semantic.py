from pathlib import Path

from fastapi import APIRouter

from app.semantic.analyzer import analyze_dataset
from app.schemas.semantic import SemanticProfile

router = APIRouter(
    prefix="/api",
    tags=["Semantic Layer"]
)


@router.post("/semantic", response_model=SemanticProfile)
def generate_semantic_metadata():
    """
    Analyze the latest uploaded dataset
    and generate semantic metadata.
    """

    uploads_folder = Path("uploads")

    csv_files = list(uploads_folder.glob("*.csv"))

    if not csv_files:
        return {
            "dataset": "",
            "measures": [],
            "dimensions": [],
            "total_measures": 0,
            "total_dimensions": 0,
            "metadata_file": ""
        }

    latest_file = max(
        csv_files,
        key=lambda file: file.stat().st_mtime
    )

    return analyze_dataset(str(latest_file))