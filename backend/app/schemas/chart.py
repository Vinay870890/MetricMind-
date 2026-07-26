from pydantic import BaseModel
from typing import List


class ChartResponse(BaseModel):
    chart_type: str
    title: str
    labels: List[str]
    values: List[float]