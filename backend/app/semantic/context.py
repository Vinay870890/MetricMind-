"""
Semantic Context Builder

Provides semantic metadata to the Planner Agent.
"""

from app.semantic.registry import registry


def build_semantic_context():
    """
    Convert registry into readable text.
    """

    lines = []

    for metric, info in registry.items():

        lines.append(
            f"{metric} -> "
            f"{info['column']} "
            f"({info['aggregation']})"
        )

    return "\n".join(lines)