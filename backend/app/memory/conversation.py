class ConversationMemory:
    """
    Stores the latest conversation context.
    """

    def __init__(self):
        self.context = {}

    def save(self, question: str, plan: dict):
        self.context = {
            "question": question,
            "metric": plan.get("metric"),
            "group_by": plan.get("group_by"),
            "top": plan.get("top"),
        }

    def load(self):
        return self.context

    def clear(self):
        self.context = {}


memory = ConversationMemory()