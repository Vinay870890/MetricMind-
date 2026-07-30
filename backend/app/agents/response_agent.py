from datetime import datetime


def response_agent(
    question: str,
    chart: dict,
    insight: str
):
    """
    Build the final AI report.
    """

    return {
        "status": "success",
        "question": question,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

        "executive_summary": insight,

        "visualization": chart,

        "metadata": {
            "engine": "MetricMind X",
            "workflow": "LangGraph",
            "version": "1.0"
        }
    }