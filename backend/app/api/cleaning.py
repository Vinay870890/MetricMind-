from fastapi import APIRouter
from pathlib import Path

from app.cleaning.cleaner import clean_dataset
from app.schemas.cleaning import CleaningReport

router = APIRouter(
    prefix="/api",
    tags=["Data Cleaning"]
)


@router.post("/clean", response_model=CleaningReport)
def clean_uploaded_dataset():
    """
    Clean the most recently uploaded dataset.
    """

    uploads_folder = Path("uploads")

    csv_files = list(uploads_folder.glob("*.csv"))

    if not csv_files:
        return {
            "status": "failed",
            "original_rows": 0,
            "cleaned_rows": 0,
            "duplicates_removed": 0,
            "missing_values_before": 0,
            "missing_values_after": 0,
            "quality_score": 0,
            "cleaned_file": ""
        }

    latest_file = max(csv_files, key=lambda f: f.stat().st_mtime)

    return clean_dataset(str(latest_file))