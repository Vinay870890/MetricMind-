from typing import TypedDict


class AgentState(TypedDict, total=False):
    """
    Shared state passed between LangGraph nodes.
    """

    # User input
    question: str
    file_path: str

    # Planner output
    plan: dict

    # Workflow routing
    route: str

    # Analytics output
    analysis: dict

    # Insight output
    insight: dict

    # Visualization output
    chart: dict

    # Final response
    response: dict

    # Execution trace
    trace: list[str]