def explanation_agent(analysis: dict, insight: str) -> str:
    """
    Generate business recommendations based on the analysis.
    """

    metric = analysis.get("metric", "").lower()

    if metric == "sales":
        recommendation = (
            "Focus marketing and inventory on the highest-performing entities. "
            "Investigate low-performing entities to identify growth opportunities."
        )

    elif metric == "profit":
        recommendation = (
            "Improve profit margins by reducing operational costs and prioritizing "
            "high-profit products or customer segments."
        )

    elif metric == "quantity":
        recommendation = (
            "Monitor demand trends and optimize inventory levels to prevent stock-outs "
            "or overstock situations."
        )

    elif metric == "discount":
        recommendation = (
            "Review discount policies to ensure promotional campaigns improve revenue "
            "without significantly reducing profitability."
        )

    else:
        recommendation = (
            "Review the generated analytics and identify opportunities for business optimization."
        )

    return (
        f"{insight}\n\n"
        f"Business Recommendation:\n{recommendation}"
    )