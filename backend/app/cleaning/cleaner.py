import os
import pandas as pd
from pandas.api.types import is_numeric_dtype

CLEANED_FOLDER = "cleaned"

os.makedirs(CLEANED_FOLDER, exist_ok=True)


def clean_dataset(file_path: str):
    """
    Clean the uploaded dataset and generate a quality report.
    """

    # Read dataset
    df = pd.read_csv(file_path)

    original_rows = len(df)

    # Count missing values before cleaning
    missing_before = int(df.isnull().sum().sum())

    # Remove duplicate rows
    duplicate_rows = int(df.duplicated().sum())
    df = df.drop_duplicates()

    # Fill missing values safely
    for column in df.columns:

        if is_numeric_dtype(df[column]):
            df[column] = df[column].fillna(df[column].median())

        else:
            mode = df[column].mode()

            if not mode.empty:
                df[column] = df[column].fillna(mode.iloc[0])

    # Count missing values after cleaning
    missing_after = int(df.isnull().sum().sum())

    cleaned_rows = len(df)

    # Save cleaned dataset
    cleaned_filename = f"cleaned_{os.path.basename(file_path)}"
    cleaned_path = os.path.join(CLEANED_FOLDER, cleaned_filename)

    df.to_csv(cleaned_path, index=False)

    # Calculate quality score
    score = 100.0
    score -= duplicate_rows * 0.05
    score -= missing_before * 0.02
    score = max(0.0, round(score, 2))

    return {
        "status": "success",
        "original_rows": original_rows,
        "cleaned_rows": cleaned_rows,
        "duplicates_removed": duplicate_rows,
        "missing_values_before": missing_before,
        "missing_values_after": missing_after,
        "quality_score": score,
        "cleaned_file": cleaned_filename,
    }