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


    # Analytics-only workflow
    if route == "analytics":

        response["analytics_result"] = analytics_result

        response["executive_summary"] = (
            "Analytics calculation completed successfully."
        )


    # Insight-only workflow
    elif route == "insight":

        response["executive_summary"] = insight


    # Visualization workflow
    elif route == "visualization":

        response["executive_summary"] = (
            "Visualization generated successfully."
        )

        response["visualization"] = chart


    # Safety fallback
    else:

        response["executive_summary"] = (
            "Unable to determine workflow output."
        )


    return response