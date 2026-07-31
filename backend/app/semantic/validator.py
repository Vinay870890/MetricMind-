from app.semantic.registry import SEMANTIC_REGISTRY


def validate_plan(plan: dict):

    metric = plan.get("metric")

    available_metrics = SEMANTIC_REGISTRY.keys()

    if metric is None:
        return {
            "valid": False,
            "error": "No valid metric detected"
        }

    if metric not in available_metrics:
        return {
            "valid": False,
            "error": f"Metric '{metric}' is not available"
        }

    return {
        "valid": True,
        "error": None
    }