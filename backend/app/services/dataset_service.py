import os
import pandas as pd


def generate_profile(file_path: str):
    """
    Generate a profile of the uploaded dataset.
    """

    # Read CSV file
    df = pd.read_csv(file_path)

    # Generate dataset profile
    profile = {
        "file_name": os.path.basename(file_path),
        "rows": len(df),
        "columns": len(df.columns),
        "missing_values": int(df.isnull().sum().sum()),
        "duplicate_rows": int(df.duplicated().sum()),
        "numeric_columns": len(df.select_dtypes(include="number").columns),
        "categorical_columns": len(df.select_dtypes(exclude="number").columns),
        "memory_usage_mb": round(
            df.memory_usage(deep=True).sum() / (1024 * 1024), 2
        ),
        "column_names": list(df.columns),
    }

    return profile