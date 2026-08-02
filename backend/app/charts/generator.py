def generate_chart(analysis: dict, chart_type: str):
    """
    Convert analytics output into a rich visualization specification.
    """

    records = analysis.get("records", [])

    if not records:
        return {
            "chart_type": chart_type,
            "title": "No Data",
            "labels": [],
            "values": [],
            "x_axis": "",
            "y_axis": "",
            "color": "#4F46E5",
            "sort": "none",
            "format": "number",
            "insight": "No records available."
        }

    dimension = list(records[0].keys())[0]
    metric = list(records[0].keys())[1]

    labels = [row[dimension] for row in records]
    values = [float(row[metric]) for row in records]

    return {
        "chart_type": chart_type,
        "title": f"{analysis['metric'].title()} by {dimension}",
        "x_axis": metric,
        "y_axis": dimension,
        "labels": labels,
        "values": values,
        "color": "#4F46E5",
        "sort": "descending",
        "format": "currency",
        "insight": analysis.get("insight", "")
    }