def insight_agent(analysis: dict) -> str:
    """
    Generate business insights from analytics results.
    """

    records = analysis.get("records", [])
    metric = analysis.get("metric", "")
    group_by = analysis.get("group_by", "")

    if not records:
        return "No business insight could be generated."

    # Find metric column
    value_column = None

    for key in records[0]:
        if key != group_by:
            value_column = key
            break

    highest = records[0]
    lowest = records[-1]

    highest_name = highest[group_by]
    highest_value = highest[value_column]

    lowest_name = lowest[group_by]
    lowest_value = lowest[value_column]

    total = sum(row[value_column] for row in records)
    average = total / len(records)

    return (
        f"Analysis Summary:\n"
        f"• Highest {metric}: {highest_name} ({highest_value:,.2f})\n"
        f"• Lowest {metric}: {lowest_name} ({lowest_value:,.2f})\n"
        f"• Average {metric}: {average:,.2f}\n"
        f"• Total {metric}: {total:,.2f}\n"
        f"• Records analyzed: {len(records)}"
    )