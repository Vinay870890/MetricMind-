import re


def parse_question(question: str):
    """
    Convert a natural-language analytics question
    into metric, group_by, and top.
    """

    q = question.lower()

    metric = None

    if "sales" in q:
        metric = "sales"
    elif "profit" in q:
        metric = "profit"
    elif "quantity" in q:
        metric = "quantity"
    elif "discount" in q:
        metric = "discount"

    group_by = None

    mapping = {
        "category": "Category",
        "sub-category": "Sub-Category",
        "customer": "Customer Name",
        "customer name": "Customer Name",
        "product": "Product Name",
        "market": "Market",
        "segment": "Segment",
        "country": "Country",
        "city": "City"
    }

    for key, value in mapping.items():
        if key in q:
            group_by = value
            break

    top = None

    match = re.search(r"top\s+(\d+)", q)

    if match:
        top = int(match.group(1))

    return {
        "metric": metric,
        "group_by": group_by,
        "top": top
    }