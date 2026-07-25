from typing import Any

from pydantic import BaseModel


class AnalyticsRequest(BaseModel):
    metric: str
    group_by: str
    top: int | None = None


class AnalyticsResponse(BaseModel):
    dataset: str
    metric: str
    group_by: str
    records: list[dict[str, Any]]