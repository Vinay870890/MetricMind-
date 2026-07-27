from typing import Dict


def generate_chart(analysis: Dict) -> Dict:
    """
    Convert analytics results into chart-ready JSON.
    """

    metric = analysis["metric"]
    group_by = analysis["group_by"]
    records = analysis["records"]

    if not records:
        return {
            "chart_type": "bar",
            "title": "No Data",
            "labels": [],
            "values": [],
            "insight": "No records found for the requested analysis."
        }

    labels = []
    values = []

    # Find the metric column (Sales, Profit, Quantity, Discount)
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

    # Business insight
    highest_label = labels[0]
    highest_value = values[0]

    total = round(sum(values), 2)
    average = round(total / len(values), 2)

    insight = (
        f"{highest_label} has the highest {metric} "
        f"({highest_value:,.2f}). "
        f"The average {metric} across {len(labels)} "
        f"{group_by.lower()} values is {average:,.2f}."
    )

    return {
        "chart_type": chart_type,
        "title": f"{metric.title()} by {group_by}",
        "labels": labels,
        "values": values,
        "insight": insight
    }