from app.charts.generator import generate_chart


def visualization_agent(analysis: dict):
    """
    Convert analytics into chart-ready data.
    """

    return generate_chart(analysis)