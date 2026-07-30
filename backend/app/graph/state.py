from typing import TypedDict


class AgentState(TypedDict):
    """
    Shared state used across the LangGraph workflow.
    """

    question: str
    file_path: str

    plan: dict
    analysis: dict
    chart: dict
    insight: str
    response: dict

    trace: list[str]