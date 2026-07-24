from pathlib import Path

import pandas as pd

from app.filters.extractor import extract_filters


def calculate_metrics(file_path: str, question: str = ""):
    """
    Calculate business KPIs from the dataset.
    Supports optional filters extracted from natural language.
    """

    # Load dataset
    df = pd.read_csv(file_path)

    # Extract filters
    filters = extract_filters(question, file_path)

    print("Detected Filters:", filters)

    # Apply filters
    filtered_df = df.copy()

    for column, value in filters.items():

        if column in filtered_df.columns:

            filtered_df = filtered_df[
                filtered_df[column]
                .astype(str)
                .str.lower()
                ==
                value.lower()
            ]

    print("Filtered Rows:", len(filtered_df))


    # No matching data
    if filtered_df.empty:

        return {
            "dataset": Path(file_path).name,
            "total_sales": 0,
            "total_profit": 0,
            "total_quantity": 0,
            "average_sales": 0,
            "average_profit": 0,
            "maximum_sales": 0,
            "minimum_sales": 0,
            "total_orders": 0,
            "unique_customers": 0,
            "unique_products": 0,
            "average_quantity": 0,
            "total_discount": 0,
            "average_discount": 0,
            "maximum_profit": 0,
            "minimum_profit": 0,
            "profit_margin": 0
        }


    metrics = {

        "dataset": Path(file_path).name,

        "total_sales": round(
            filtered_df["Sales"].sum(), 2
        ),

        "total_profit": round(
            filtered_df["Profit"].sum(), 2
        ),

        "total_quantity": int(
            filtered_df["Quantity"].sum()
        ),


        "average_sales": round(
            filtered_df["Sales"].mean(), 2
        ),

        "average_profit": round(
            filtered_df["Profit"].mean(), 2
        ),


        "maximum_sales": round(
            filtered_df["Sales"].max(), 2
        ),

        "minimum_sales": round(
            filtered_df["Sales"].min(), 2
        ),


        "total_orders": int(
            len(filtered_df)
        ),

        "unique_customers": int(
            filtered_df["Customer ID"].nunique()
        ),

        "unique_products": int(
            filtered_df["Product ID"].nunique()
        ),


        "average_quantity": round(
            filtered_df["Quantity"].mean(), 2
        ),

        "total_discount": round(
            filtered_df["Discount"].sum(), 2
        ),

        "average_discount": round(
            filtered_df["Discount"].mean(), 2
        ),


        "maximum_profit": round(
            filtered_df["Profit"].max(), 2
        ),

        "minimum_profit": round(
            filtered_df["Profit"].min(), 2
        ),


        "profit_margin": round(
            (
                filtered_df["Profit"].sum()
                /
                filtered_df["Sales"].sum()
            ) * 100,
            2
        )
        if filtered_df["Sales"].sum() != 0 else 0
    }


    return metrics