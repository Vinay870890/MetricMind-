from app.metrics.calculator import calculate_metrics


def process_query(question: str, file_path: str):
    """
    Process a natural language business question.
    """

    metrics = calculate_metrics(file_path)

    question = question.lower()

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

        if keyword in question:

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