from pydantic import BaseModel
from typing import List


class SemanticProfile(BaseModel):
    dataset: str
    measures: List[str]
    dimensions: List[str]
    total_measures: int
    total_dimensions: int
    metadata_file: str