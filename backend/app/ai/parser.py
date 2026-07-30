import re


def parse_question(question: str):
    """
    Convert a natural-language analytics question
    into metric, group_by, and top.
    """

    q = question.lower().strip()

    # -------------------------
    # Detect metric
    # -------------------------
    metric = None

    if "sales" in q:
        metric = "sales"
    elif "profit" in q:
        metric = "profit"
    elif "quantity" in q:
        metric = "quantity"
    elif "discount" in q:
        metric = "discount"

    # -------------------------
    # Detect grouping column
    # -------------------------
    group_by = None

    mapping = {
        # Customer
        "customer name": "Customer Name",
        "customer": "Customer Name",

        # Product
        "product name": "Product Name",
        "product": "Product Name",

        # Product hierarchy
        "sub-category": "Sub-Category",
        "subcategory": "Sub-Category",
        "category": "Category",

        # Geography
        "market": "Market",
        "region": "Region",
        "country": "Country",
        "city": "City",
        "state": "State",

        # Business
        "segment": "Segment",
        "ship mode": "Ship Mode",
        "shipmode": "Ship Mode",
        "shipping": "Ship Mode",

        # Order
        "order priority": "Order Priority"
    }

    for key, value in mapping.items():
        if key in q:
            group_by = value
            break

    # -------------------------
    # Detect Top N
    # -------------------------
    top = None

    match = re.search(r"top\s+(\d+)", q)

    if match:
        top = int(match.group(1))

    # -------------------------
    # Validation
    # -------------------------
    if group_by is None:
        if any(word in q for word in [
            "total",
            "overall",
            "summary",
            "average"
        ]):
            group_by = "Category"
        else:
            raise ValueError(
                "Could not identify a grouping column from the question."
            )

    return {
        "metric": metric,
        "group_by": group_by,
        "top": top
    }