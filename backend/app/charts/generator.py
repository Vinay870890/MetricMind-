from typing import Dict


def generate_chart(analysis: Dict) -> Dict:
    """
    Convert analytics results into chart-ready JSON.
    """

    metric = analysis["metric"]
    group_by = analysis["group_by"]
    records = analysis["records"]

    labels = []
    values = []

    # Find the metric column (Sales, Profit, Quantity, etc.)
    value_column = None

    for key in records[0].keys():
        if key != group_by:
            value_column = key
            break

    for row in records:
        labels.append(str(row[group_by]))
        values.append(float(row[value_column]))

    # Select chart automatically
    if len(labels) <= 5:
        chart_type = "bar"
    elif len(labels) <= 10:
        chart_type = "horizontal_bar"
    else:
        chart_type = "line"

    return {
        "chart_type": chart_type,
        "title": f"{metric.title()} by {group_by}",
        "labels": labels,
        "values": values
    }