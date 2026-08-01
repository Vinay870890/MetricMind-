def recommend_chart(plan: dict, analysis: dict):
    """
    Intelligent chart recommendation engine.
    """

    group_by = plan.get("group_by")
    records = analysis.get("records", [])

    count = len(records)


    # Time series data
    if group_by in [
        "Order Date",
        "Year",
        "Month"
    ]:
        return "line"


    # Small categorical comparison
    if count <= 5:
        return "pie"


    # Large ranking data
    if count > 10:
        return "horizontal_bar"


    # Default comparison
    return "bar"