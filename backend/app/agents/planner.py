from app.ai.parser import parse_question
from app.semantic.context import build_semantic_context


def planner_agent(question: str):
    """
    Planner Agent

    Uses the Semantic Layer to understand
    the user's analytics request.
    """

    semantic_context = build_semantic_context()

    plan = parse_question(question)

    plan["semantic_context"] = semantic_context

    
    return plan