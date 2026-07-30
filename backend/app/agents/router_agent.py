def router_agent(plan: dict) -> str:
    """
    Decide which workflow route should be executed
    based on the planner output.
    """

    metric = plan.get("metric")
    group_by = plan.get("group_by")

    # If grouping exists, the user likely wants a chart.
    if group_by:
        return "visualization"

    # If only a metric exists, return an insight.
    if metric:
        return "insight"

    # Default route.
    return "analytics"