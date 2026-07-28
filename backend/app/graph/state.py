from typing import TypedDict

class AgentState(TypedDict, total=False):
    question: str
    file_path: str
    plan: dict
    analysis: dict
    chart: dict
    response: dict
    trace: list[str]