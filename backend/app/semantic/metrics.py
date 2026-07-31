"""
Enterprise Metric Registry

This module defines all business measures used by MetricMind.

Instead of allowing agents to directly reference dataset columns,
they must retrieve metric definitions from this registry.

This mimics how enterprise Semantic Layers (Cube.dev/dbt)
store governed business metrics.
"""

METRICS = {
    "revenue": {
        "name": "Revenue",
        "column": "Sales",
        "aggregation": "sum",
        "description": "Total sales revenue."
    },

    "sales": {
        "name": "Sales",
        "column": "Sales",
        "aggregation": "sum",
        "description": "Total sales amount."
    },

    "profit": {
        "name": "Profit",
        "column": "Profit",
        "aggregation": "sum",
        "description": "Total profit earned."
    },

    "quantity": {
        "name": "Quantity",
        "column": "Quantity",
        "aggregation": "sum",
        "description": "Total quantity sold."
    },

    "discount": {
        "name": "Discount",
        "column": "Discount",
        "aggregation": "sum",
        "description": "Total discount given."
    },

    "margin": {
        "name": "Margin",
        "formula": "Profit / Sales",
        "description": "Business margin calculated from Profit divided by Sales."
    }
}


def get_metric(metric_name: str):
    """
    Return the semantic definition of a business metric.

    Parameters
    ----------
    metric_name : str

    Returns
    -------
    dict | None
    """

    if not metric_name:
        return None

    return METRICS.get(metric_name.lower())