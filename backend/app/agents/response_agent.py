from app.memory.session_memory import memory


def response_agent(question: str, chart: dict):
    """
    Generate the final AI response with conversation context.
    """

    previous_question = None

    if len(memory.history) > 0:
        previous_question = memory.history[-1]["question"]

    response = {
        "status": "success",
        "question": question,
        "chart": chart,
        "insight": chart.get("insight", "")
    }

    if previous_question:
        response["context"] = (
            f"Previous analysis: '{previous_question}'"
        )

    return response