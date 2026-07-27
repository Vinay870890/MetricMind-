from app.analytics.analyzer import analyze


def analytics_agent(file_path: str, plan: dict):
    """
    Execute business analytics from the Planner Agent's plan.
    """

    return analyze(
        file_path=file_path,
        metric=plan["metric"],
        group_by=plan["group_by"],
        top=plan["top"]
    )