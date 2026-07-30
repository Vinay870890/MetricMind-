from app.ai.parser import parse_question
from app.agents.router_agent import router_agent


def planner_agent(question: str):
    """
    Understand the user's request, create an execution plan,
    and determine which workflow route should be executed.
    """

    plan = parse_question(question)

    # Decide workflow route
    plan["route"] = router_agent(plan)

    return plan