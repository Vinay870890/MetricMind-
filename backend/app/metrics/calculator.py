from pathlib import Path

import pandas as pd


def calculate_metrics(file_path: str):
    """
    Calculate business KPIs from the dataset.
    """

    # Read CSV
    df = pd.read_csv(file_path)

    metrics = {
        "dataset": Path(file_path).name,

        # Basic KPIs
        "total_sales": round(df["Sales"].sum(), 2),
        "total_profit": round(df["Profit"].sum(), 2),
        "total_quantity": int(df["Quantity"].sum()),

        "average_sales": round(df["Sales"].mean(), 2),
        "average_profit": round(df["Profit"].mean(), 2),

        "maximum_sales": round(df["Sales"].max(), 2),
        "minimum_sales": round(df["Sales"].min(), 2),

        # Business KPIs
        "total_orders": int(len(df)),
        "unique_customers": int(df["Customer ID"].nunique()),
        "unique_products": int(df["Product ID"].nunique()),

        # Advanced KPIs
        "average_quantity": round(df["Quantity"].mean(), 2),
        "total_discount": round(df["Discount"].sum(), 2),
        "average_discount": round(df["Discount"].mean(), 2),

        "maximum_profit": round(df["Profit"].max(), 2),
        "minimum_profit": round(df["Profit"].min(), 2),

        "profit_margin": round(
            (df["Profit"].sum() / df["Sales"].sum()) * 100,
            2
        ) if df["Sales"].sum() != 0 else 0
    }

    return metrics