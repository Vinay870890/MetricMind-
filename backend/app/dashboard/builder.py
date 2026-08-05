from app.dashboard.widgets import build_kpi_cards
from app.dashboard.interactions import build_interactions
from app.dashboard.exporter import export_options
from app.dashboard.metadata import dashboard_metadata
import uuid

def build_dashboard(chart: dict, analysis: dict):
    """
    Build a complete AI-generated business dashboard specification.
    """

    return {
        "dashboard_id": str(uuid.uuid4()),

        "title": "MetricMind Dashboard",

        "description": "AI-generated business dashboard",

        "theme": "light",

        "layout": {
            "type": "grid",
            "columns": 12,
            "responsive": True,
            "gap": 16
        },

        # -----------------------------
        # Dashboard Filters
        # -----------------------------
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

        # -----------------------------
        # KPI + Chart Widgets
        # -----------------------------
        "widgets": (
            build_kpi_cards(analysis)
            + [
                {
                    "id": "chart_1",
                    "type": "chart",
                    "width": 12,
                    "height": 6,
                    "title": chart.get("title"),
                    "description": "Generated automatically",
                    "created_by": "MetricMind X",
                    "config": chart
                }
            ]
        ),

        # -----------------------------
        # Dashboard Interactions
        # -----------------------------
        "interactions": build_interactions(),

        # -----------------------------
        # Export Options
        # -----------------------------
        "export": export_options(),

        # -----------------------------
        # Analytics Data
        # -----------------------------
        "analysis": analysis,

        # -----------------------------
        # Dashboard Metadata
        # -----------------------------
        "metadata": dashboard_metadata()
    }