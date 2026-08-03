from app.memory.session_memory import SESSION_MEMORY


def save_context(session_id: str, plan: dict):
    """
    Save latest semantic plan.
    """

    SESSION_MEMORY[session_id] = plan


def get_context(session_id: str):
    """
    Retrieve latest semantic plan.
    """

    return SESSION_MEMORY.get(session_id)