from app.ai.parser import parse_question


def planner_agent(question: str):
    plan = parse_question(question)

    print("PLANNER OUTPUT:", plan)

    return plan