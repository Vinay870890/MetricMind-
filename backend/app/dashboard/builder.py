from app.dashboard.widgets import build_kpi_cards


def build_dashboard(chart: dict, analysis: dict):
    """
    Build a complete dashboard specification.
    """

    return {
        "dashboard_id": "metricmind_dashboard",
        "title": "MetricMind Dashboard",
        "description": "AI-generated business dashboard",
        "theme": "light",

        "layout": {
            "type": "single_column",
            "responsive": True
        },

        "filters": [
            {
                "name": "Date",
                "type": "date_range"
            },
            {
                "name": "Region",
                "type": "dropdown"
            },
            {
                "name": "Category",
                "type": "dropdown"
            }
        ],

        "widgets": (
            build_kpi_cards(analysis)
            + [
                {
                    "id": "chart_1",
                    "type": "chart",
                    "width": 12,
                    "height": 6,
                    "config": chart
                }
            ]
        ),

        "analysis": analysis,

        "metadata": {
            "generated_by": "MetricMind X",
            "version": "1.0"
        }
    }