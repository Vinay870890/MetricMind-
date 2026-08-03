import re


def resolve_followup(question: str, previous_plan: dict):
    """
    Merge follow-up queries into previous semantic plan.
    """

    if previous_plan is None:
        return None

    plan = previous_plan.copy()

    q = question.lower()

    match = re.search(r"top\s+(\d+)", q)

    if match:
        plan["top"] = int(match.group(1))

    if "ascending" in q:

        plan["sort"] = "asc"

    elif "descending" in q:

        plan["sort"] = "desc"

    if "pie" in q:

        plan["chart_type"] = "pie"

    elif "bar" in q:

        plan["chart_type"] = "bar"

    elif "line" in q:

        plan["chart_type"] = "line"

    return plan