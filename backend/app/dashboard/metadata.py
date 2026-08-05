from datetime import datetime


def dashboard_metadata():
    """
    Dashboard metadata.
    """

    return {
        "generated_by": "MetricMind X",
        "version": "1.0",
        "generated_at": datetime.now().isoformat(),
        "dashboard_type": "business_dashboard"
    }