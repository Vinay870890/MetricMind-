from pathlib import Path

from fastapi import APIRouter

from app.metrics.calculator import calculate_metrics
from app.schemas.metrics import MetricsReport

router = APIRouter(
    prefix="/api",
    tags=["Business Metrics"]
)


@router.post("/metrics", response_model=MetricsReport)
def generate_metrics():
    """
    Calculate business KPIs for the latest uploaded dataset.
    """

    uploads_folder = Path("uploads")

    csv_files = list(uploads_folder.glob("*.csv"))

    # If no dataset has been uploaded
    if not csv_files:
        return {
            "dataset": "",
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

    # Get the latest uploaded CSV file
    latest_file = max(
        csv_files,
        key=lambda file: file.stat().st_mtime
    )

    # Calculate and return business metrics
    return calculate_metrics(str(latest_file))