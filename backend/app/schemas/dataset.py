from typing import List
from pydantic import BaseModel


class DatasetProfile(BaseModel):
    file_name: str
    rows: int
    columns: int
    missing_values: int
    duplicate_rows: int
    numeric_columns: int
    categorical_columns: int
    memory_usage_mb: float
    column_names: List[str]