from app.ai.parser import parse_question


def planner_agent(question: str):
    """
    Understand the user's request and create an execution plan.
    """
    return parse_question(question)