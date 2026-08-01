from app.charts.generator import generate_chart
from app.visualization.recommender import recommend_chart


def visualization_agent(
    analysis: dict,
    plan: dict
):
    """
    Convert analytics into intelligent visualization.
    """

    chart_type = recommend_chart(
        plan,
        analysis
    )

    chart = generate_chart(analysis)

    chart["chart_type"] = chart_type

    return chart