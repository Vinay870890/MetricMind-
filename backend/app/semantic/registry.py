"""
MetricMind X
Semantic Registry

Every business metric is defined here.
Agents never invent metrics.
"""

registry = {

    "sales": {
        "column": "Sales",
        "aggregation": "sum",
        "description": "Total sales revenue"
    },

    "profit": {
        "column": "Profit",
        "aggregation": "sum",
        "description": "Total profit"
    },

    "discount": {
        "column": "Discount",
        "aggregation": "sum",
        "description": "Total discount"
    },

    "quantity": {
        "column": "Quantity",
        "aggregation": "sum",
        "description": "Total quantity sold"
    }
}


# Alias for Semantic Validator
SEMANTIC_REGISTRY = registry