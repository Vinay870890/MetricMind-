def build_kpi_cards(analysis: dict):
    """
    Generate KPI cards from analytics results.
    """

    if not analysis:
        return []

    records = analysis.get("records", [])

    if not records:
        return []

    metric = analysis.get("metric", "sales")
    metric_column = metric.capitalize()   # sales -> Sales

    values = []

    for row in records:
        if metric_column in row:
            values.append(row[metric_column])

    if not values:
        return []

    total = sum(values)
    average = total / len(values)
    highest = max(values)
    lowest = min(values)

    return [
        {
            "id": "kpi_total",
            "type": "kpi",
            "width": 3,
            "height": 1,
            "title": f"Total {metric.title()}",
            "value": round(total, 2)
        },
        {
            "id": "kpi_average",
            "type": "kpi",
            "title": f"Average {metric.title()}",
            "value": round(average, 2)
        },
        {
            "id": "kpi_highest",
            "type": "kpi",
            "title": f"Highest {metric.title()}",
            "value": round(highest, 2)
        },
        {
            "id": "kpi_lowest",
            "type": "kpi",
            "title": f"Lowest {metric.title()}",
            "value": round(lowest, 2)
        }
    ]