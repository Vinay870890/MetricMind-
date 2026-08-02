from app.ai.parser import parse_question
from app.semantic.context import build_semantic_context
from app.semantic.normalizer import normalize_metric
from app.memory.conversation import memory

def planner_agent(question: str):
    """
    Planner Agent with conversational memory.
    """

    plan = parse_question(question)

    previous = memory.load()

    if previous:

        if plan["metric"] is None:
            plan["metric"] = previous.get("metric")

        if plan["group_by"] is None:
            plan["group_by"] = previous.get("group_by")

        if plan["top"] is None:
            plan["top"] = previous.get("top")

    return plan
