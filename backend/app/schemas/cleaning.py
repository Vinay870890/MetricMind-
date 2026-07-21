from pydantic import BaseModel


class CleaningReport(BaseModel):
    status: str
    original_rows: int
    cleaned_rows: int
    duplicates_removed: int
    missing_values_before: int
    missing_values_after: int
    quality_score: float
    cleaned_file: str