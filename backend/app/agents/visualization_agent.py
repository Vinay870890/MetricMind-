from app.visualization.recommender import recommend_chart
from app.charts.generator import generate_chart
from app.dashboard.builder import build_dashboard

def visualization_agent(plan: dict, analysis: dict):
    """
    Generate an intelligent visualization specification.
    """

    chart_type = recommend_chart(plan, analysis)

    chart = generate_chart(
        analysis,
        chart_type
    )
    dashboard = build_dashboard(chart)

    return dashboard
    