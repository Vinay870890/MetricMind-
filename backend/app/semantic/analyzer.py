import json
from pathlib import Path

import pandas as pd
from pandas.api.types import is_numeric_dtype

# Metadata folder
METADATA_FOLDER = Path("metadata")
METADATA_FOLDER.mkdir(exist_ok=True)


def analyze_dataset(file_path: str):
    """
    Analyze dataset and generate semantic metadata.
    """

    df = pd.read_csv(file_path)

    measures = []
    dimensions = []

    # Detect Measures and Dimensions
    for column in df.columns:

        if is_numeric_dtype(df[column]):
            measures.append(column)

        else:
            dimensions.append(column)

    metadata = {
        "dataset": Path(file_path).name,
        "measures": measures,
        "dimensions": dimensions,
        "total_measures": len(measures),
        "total_dimensions": len(dimensions)
    }

    metadata_filename = (
        Path(file_path).stem +
        "_metadata.json"
    )

    metadata_path = METADATA_FOLDER / metadata_filename

    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)

    metadata["metadata_file"] = metadata_filename

    return metadata