from pathlib import Path

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

from app.dashboard.storage import get_dashboard


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard Filtering"]
)


# ============================================================
# Request Schema
# ============================================================

class DashboardFilterRequest(BaseModel):
    dashboard_id: str
    filters: dict[str, str | int]


# ============================================================
# Dataset Location
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data"


# ============================================================
# Find Dataset
# ============================================================

def find_dataset(dataset_name: str):

    dataset_path = DATA_DIR / dataset_name

    if dataset_path.exists():
        return dataset_path

    # Search backend recursively if required
    for path in BASE_DIR.rglob(dataset_name):

        if path.is_file():
            return path

    return None


# ============================================================
# Apply Filters
# ============================================================

def apply_filters(
    df: pd.DataFrame,
    filters: dict[str, str | int]
):

    filtered_df = df.copy()

    for column, value in filters.items():

        if column not in filtered_df.columns:
            continue

        # Year is numeric
        if column == "Year":

            filtered_df = filtered_df[
                filtered_df[column].astype(str)
                == str(value)
            ]

        else:

            filtered_df = filtered_df[
                filtered_df[column]
                .astype(str)
                .str.strip()
                .str.lower()
                ==
                str(value)
                .strip()
                .lower()
            ]

    return filtered_df


# ============================================================
# Build Filtered Dashboard Result
# ============================================================

@router.post("/filter")
def filter_dashboard(
    request: DashboardFilterRequest
):

    # --------------------------------------------------------
    # Load saved dashboard
    # --------------------------------------------------------

    saved_dashboard = get_dashboard(
        request.dashboard_id
    )

    if saved_dashboard is None:

        return {
            "status": "error",
            "message": "Dashboard not found."
        }


    dashboard = saved_dashboard.get(
        "dashboard",
        {}
    )


    # --------------------------------------------------------
    # Find dataset
    # --------------------------------------------------------

    analysis = dashboard.get(
        "analysis",
        {}
    )

    dataset_name = analysis.get(
        "dataset"
    )

    if not dataset_name:

        return {
            "status": "error",
            "message": "Dataset information not found."
        }


    dataset_path = find_dataset(
        dataset_name
    )

    if dataset_path is None:

        return {
            "status": "error",
            "message": (
                f"Dataset '{dataset_name}' "
                "was not found."
            )
        }


    # --------------------------------------------------------
    # Load CSV
    # --------------------------------------------------------

    df = pd.read_csv(
        dataset_path
    )


    # --------------------------------------------------------
    # Apply Dashboard Filters
    # --------------------------------------------------------

    filtered_df = apply_filters(
        df,
        request.filters
    )


    # --------------------------------------------------------
    # Metric
    # --------------------------------------------------------

    metric = analysis.get(
        "metric",
        "sales"
    )


    metric_columns = {
        "sales": "Sales",
        "profit": "Profit",
        "quantity": "Quantity",
        "discount": "Discount"
    }


    metric_column = metric_columns.get(
        metric
    )


    if metric_column is None:

        return {
            "status": "error",
            "message": (
                f"Unsupported metric: {metric}"
            )
        }


    # --------------------------------------------------------
    # Group By
    # --------------------------------------------------------

    group_by = analysis.get(
        "group_by"
    )


    # --------------------------------------------------------
    # KPI Calculations
    # --------------------------------------------------------

    total = round(
        float(
            filtered_df[metric_column].sum()
        ),
        2
    )


    average = round(
        float(
            filtered_df[metric_column].mean()
        ),
        2
    ) if not filtered_df.empty else 0


    highest = round(
        float(
            filtered_df[metric_column].max()
        ),
        2
    ) if not filtered_df.empty else 0


    lowest = round(
        float(
            filtered_df[metric_column].min()
        ),
        2
    ) if not filtered_df.empty else 0


    # --------------------------------------------------------
    # Grouped Chart Data
    # --------------------------------------------------------

    records = []


    if (
        group_by
        and group_by in filtered_df.columns
        and not filtered_df.empty
    ):

        grouped = (
            filtered_df
            .groupby(group_by)[metric_column]
            .sum()
            .sort_values(
                ascending=False
            )
            .reset_index()
        )


        records = grouped.to_dict(
            orient="records"
        )


        # ----------------------------------------------------
        # Convert NumPy values to native Python values
        # ----------------------------------------------------
        # Prevents FastAPI serialization error:
        # numpy.int64 object is not iterable
        # ----------------------------------------------------

        records = [
            {
                key: value.item()
                if hasattr(value, "item")
                else value
                for key, value in record.items()
            }
            for record in records
        ]


    # --------------------------------------------------------
    # Update Chart Labels and Values
    # --------------------------------------------------------

    widgets = dashboard.get(
        "widgets",
        []
    )


    updated_widgets = []


    for widget in widgets:

        updated_widget = widget.copy()


        # ----------------------------------------------------
        # KPI
        # ----------------------------------------------------

        if widget.get("type") == "kpi":

            title = (
                widget.get("title", "")
                .lower()
            )


            if "total" in title:

                updated_widget["value"] = total

            elif "average" in title:

                updated_widget["value"] = average

            elif "highest" in title:

                updated_widget["value"] = highest

            elif "lowest" in title:

                updated_widget["value"] = lowest


        # ----------------------------------------------------
        # Chart
        # ----------------------------------------------------

        elif widget.get("type") == "chart":

            config = (
                widget
                .get("config", {})
                .copy()
            )


            labels = []

            values = []


            for record in records:

                if group_by in record:

                    labels.append(
                        str(
                            record[group_by]
                        )
                    )


                    values.append(
                        round(
                            float(
                                record[
                                    metric_column
                                ]
                            ),
                            2
                        )
                    )


            config["labels"] = labels

            config["values"] = values


            updated_widget["config"] = config


        updated_widgets.append(
            updated_widget
        )


    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {

        "status": "success",

        "dashboard_id":
            request.dashboard_id,

        "filters":
            request.filters,

        "filtered_rows":
            int(
                len(filtered_df)
            ),

        "kpis": {

            "total":
                total,

            "average":
                average,

            "highest":
                highest,

            "lowest":
                lowest
        },

        "records":
            records,

        "widgets":
            updated_widgets
    }