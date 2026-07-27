def response_agent(question: str, chart: dict):
    """
    Produce the final AI response.
    """

    return {
        "question": question,
        "chart": chart,
        "status": "success"
    }