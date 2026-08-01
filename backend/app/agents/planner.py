from app.ai.parser import parse_question
from app.semantic.context import build_semantic_context
from app.semantic.normalizer import normalize_metric

def planner_agent(question: str):
    """
    Planner Agent

    Uses the Semantic Layer to understand
    the user's analytics request.
    """

    semantic_context = build_semantic_context()

    plan = parse_question(question)

    plan["metric"] = normalize_metric(
        plan.get("metric")
)

    plan["semantic_context"] = semantic_context
    
    return plan


