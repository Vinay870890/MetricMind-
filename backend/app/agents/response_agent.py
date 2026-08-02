from datetime import datetime


def response_agent(
    question: str,
    route: str,
    analytics_result=None,
    insight=None,
    chart=None
):
    """
    Build final response based on executed workflow route.
    """

    response = {
        "status": "success",
        "question": question,
        "generated_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
        "route": route,
        "metadata": {
            "engine": "MetricMind X",
            "workflow": "LangGraph",
            "version": "1.0"
        }
    }

    # ----------------------------
    # Analytics workflow
    # ----------------------------
    if route == "analytics":

        response["analytics_result"] = analytics_result

        response["executive_summary"] = (
            "Analytics calculation completed successfully."
        )

    # ----------------------------
    # Insight workflow
    # ----------------------------
    elif route == "insight":

        response["executive_summary"] = insight

    # ----------------------------
    # Visualization workflow
    # ----------------------------
    elif route == "visualization":

        response["dashboard"] = chart

        if insight:
            response["executive_summary"] = (
                "Business Analysis Completed.\n\n"
                f"{insight}\n\n"
                f"Recommended Visualization: "
                f"{chart.get('chart_type', 'bar')} chart."
            )
        else:
            response["executive_summary"] = (
                "Visualization generated successfully."
            )

    # ----------------------------
    # Safety fallback
    # ----------------------------
    else:

        response["executive_summary"] = (
            "Unable to determine workflow output."
        )

    return response