from collections import deque
class SessionMemory:
    """
    Stores conversation history for the current session.
    """

    def __init__(self):
        self.history = []

    def add(self, question, response):
        self.history.append(
            {
                "question": question,
                "response": response
            }
        )

    def get_all(self):
        return self.history

    def search(self, keyword: str):
        """
        Search previous conversations by keyword.
        """

        keyword = keyword.lower()

        results = []

        for item in self.history:
            if keyword in item["question"].lower():
                results.append(item)

        return results

    def clear(self):
        self.history = []


memory = SessionMemory()