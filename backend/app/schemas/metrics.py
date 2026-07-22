from pydantic import BaseModel


class MetricsReport(BaseModel):
    dataset: str

    total_sales: float
    total_profit: float
    total_quantity: int

    average_sales: float
    average_profit: float

    maximum_sales: float
    minimum_sales: float

    total_orders: int

    unique_customers: int
    unique_products: int

    average_quantity: float

    total_discount: float
    average_discount: float

    maximum_profit: float
    minimum_profit: float

    profit_margin: float