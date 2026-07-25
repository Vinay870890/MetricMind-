from pathlib import Path

import pandas as pd


def analyze(
    file_path: str,
    metric: str,
    group_by: str,
    top: int | None = None
):
    """
    Perform grouped business analytics.
    """

    df = pd.read_csv(file_path)

    aggregation = {
        "sales": "Sales",
        "profit": "Profit",
        "quantity": "Quantity",
        "discount": "Discount"
    }

    if metric not in aggregation:
        return []

    column = aggregation[metric]

    result = (
        df.groupby(group_by)[column]
        .sum()
        .sort_values(ascending=False)
        .reset_index()
    )

    if top:
        result = result.head(top)

    return {
        "dataset": Path(file_path).name,
        "metric": metric,
        "group_by": group_by,
        "records": result.to_dict(orient="records")
    }