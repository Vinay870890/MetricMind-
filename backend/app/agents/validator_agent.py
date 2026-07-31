from app.semantic.validator import validate_plan


def validator_agent(plan: dict):

    result = validate_plan(plan)

    return result