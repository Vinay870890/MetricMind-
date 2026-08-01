import re

from app.semantic.registry import registry

# Metric synonyms
METRIC_SYNONYMS = {
    "sales": "sales",
    "sale": "sales",
    "revenue": "sales",

    "profit": "profit",
    "profits": "profit",

    "discount": "discount",
    "discounts": "discount",

    "quantity": "quantity",
    "qty": "quantity",
}


def parse_question(question: str):
    """
    Convert a natural language question into a semantic execution plan.
    """

    q = question.lower()

    metric = None

    # Metric Detection
    for keyword, normalized_metric in METRIC_SYNONYMS.items():
        if keyword in q:
            metric = normalized_metric
            break

    # Dimension Detection
    mapping = {
        "category": "Category",
        "sub-category": "Sub-Category",
        "customer": "Customer Name",
        "customer name": "Customer Name",
        "product": "Product Name",
        "market": "Market",
        "segment": "Segment",
        "country": "Country",
        "city": "City",
        "region": "Region",
        "ship mode": "Ship Mode",
        "state": "State",
    }

    group_by = None

    for keyword, column in mapping.items():
        if keyword in q:
            group_by = column
            break

    # Top N Detection
    top = None

    match = re.search(r"top\s+(\d+)", q)

    if match:
        top = int(match.group(1))

    return {
        "metric": metric,
        "group_by": group_by,
        "top": top,
    }