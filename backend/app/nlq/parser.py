import re

from app.analytics.analyzer import analyze
from app.metrics.calculator import calculate_metrics


def process_query(question: str, file_path: str):
    """
    Process business questions.
    Supports:
    - KPI questions
    - Top N analytics
    - Grouped analytics
    """

    question_lower = question.lower()

    # -----------------------------
    # TOP N ANALYTICS
    # -----------------------------
    top_match = re.search(
        r"top\s+(\d+)\s+(\w+)\s+by\s+(\w+)",
        question_lower
    )

    if top_match:

        top = int(top_match.group(1))
        group = top_match.group(2)
        metric = top_match.group(3)

        group_mapping = {
            "customers": "Customer Name",
            "customer": "Customer Name",

            "products": "Product Name",
            "product": "Product Name",

            "countries": "Country",
            "country": "Country",

            "markets": "Market",
            "market": "Market",

            "categories": "Category",
            "category": "Category",

            "regions": "Region",
            "region": "Region",

            "segments": "Segment",
            "segment": "Segment"
        }

        metric_mapping = {
            "sales": "sales",
            "profit": "profit",
            "quantity": "quantity",
            "discount": "discount"
        }

        if (
            group in group_mapping
            and metric in metric_mapping
        ):
            return analyze(
                file_path,
                metric_mapping[metric],
                group_mapping[group],
                top
            )

    # -----------------------------
    # GROUP BY ANALYTICS
    # -----------------------------
    group_match = re.search(
        r"(sales|profit|quantity|discount)\s+by\s+(.+)",
        question_lower
    )

    if group_match:

        metric = group_match.group(1)
        group = group_match.group(2)

        group_mapping = {
            "category": "Category",
            "market": "Market",
            "country": "Country",
            "customer": "Customer Name",
            "product": "Product Name",
            "segment": "Segment",
            "region": "Region"
        }

        if group in group_mapping:
            return analyze(
                file_path,
                metric,
                group_mapping[group]
            )

    # -----------------------------
    # KPI QUESTIONS
    # -----------------------------
    metrics = calculate_metrics(file_path)

    mapping = {
        "total sales": "total_sales",
        "sales": "total_sales",

        "total profit": "total_profit",
        "profit": "total_profit",

        "quantity": "total_quantity",

        "average sales": "average_sales",
        "average profit": "average_profit",

        "maximum sales": "maximum_sales",
        "minimum sales": "minimum_sales",

        "orders": "total_orders",

        "customers": "unique_customers",

        "products": "unique_products",

        "discount": "total_discount",

        "profit margin": "profit_margin"
    }

    for keyword, metric in mapping.items():

        if keyword in question_lower:

            return {
                "question": question,
                "metric": metric,
                "value": metrics[metric]
            }

    return {
        "question": question,
        "metric": "unknown",
        "value": "Sorry, I don't understand the question."
    }