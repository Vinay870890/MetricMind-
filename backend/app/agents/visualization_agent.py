from app.visualization.recommender import recommend_chart
from app.charts.generator import generate_chart
from app.dashboard.builder import build_dashboard


def visualization_agent(plan: dict, analysis: dict):
    """
    Generate dashboard from analytics results.
    """

    print("\n===== ANALYSIS RECEIVED =====")
    print(analysis)
    print("============================")

    chart_type = recommend_chart(
        plan,
        analysis
    )

    chart = generate_chart(
        analysis,
        chart_type
    )

    # Attach analytics before dashboard creation
    dashboard = build_dashboard(
        chart,
        analysis
    )

    return dashboard