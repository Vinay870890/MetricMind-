def build_dashboard(chart: dict):
    """
    Build a dashboard specification from chart metadata.
    """

    return {
        "layout": "single",
        "theme": "light",
        "title": "MetricMind Dashboard",
        "widgets": [
            {
                "type": "chart",
                "config": chart
            }
        ]
    }