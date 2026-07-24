from pathlib import Path
import pandas as pd
import re


# Natural language normalization
SYNONYMS = {
    "europe": "eu",
    "european": "eu",

    "asia pacific": "apac",
    "asia-pacific": "apac",

    "latin america": "latam",
    "latin-america": "latam",

    "united states": "us",
    "usa": "us",
    "u.s.": "us",

    "middle east": "emea"
}


# Words that should never become filters
IGNORE_WORDS = {
    "sales",
    "sale",
    "total_sales",
    "total sales",

    "profit",
    "profits",
    "revenue",

    "quantity",
    "orders",
    "order",

    "discount",
    "average",
    "maximum",
    "minimum",

    "count",
    "sum"
}


CACHE = {}



def load_filter_values(file_path: str):
    """
    Load unique filter values from dataset.

    Stores:
        normalized value -> original value
    """

    if file_path in CACHE:
        return CACHE[file_path]


    df = pd.read_csv(file_path)


    candidate_columns = [
        "Country",
        "Region",
        "Market",
        "Category",
        "Sub-Category",
        "Segment",
        "Ship Mode",
        "Order Priority",
        "State",
        "City",
        "Year"
    ]


    values = {}


    for column in candidate_columns:

        if column not in df.columns:
            continue


        if column == "Year":

            values[column] = {
                str(v): v
                for v in df[column]
                .dropna()
                .unique()
            }


        else:

            values[column] = {
                str(v).strip().lower(): str(v).strip()
                for v in df[column]
                .dropna()
                .unique()
            }


    CACHE[file_path] = values

    return values





def normalize_question(question: str):
    """
    Normalize user question.
    """

    question = question.lower()


    # replace underscore with space
    question = question.replace("_", " ")


    for original, replacement in SYNONYMS.items():

        question = question.replace(
            original,
            replacement
        )


    return question





def contains_word(question, value):
    """
    Exact word matching.

    Prevents:
        sale -> sales
        us -> australia
    """

    pattern = r"\b" + re.escape(value.lower()) + r"\b"

    return re.search(pattern, question.lower())





def extract_filters(question: str, file_path: str):
    """
    Extract filters from natural language question.
    """


    filters = {}


    question = normalize_question(question)


    filter_values = load_filter_values(file_path)



    # Match categorical columns

    for column, values in filter_values.items():


        if column == "Year":
            continue



        for normalized_value, original_value in values.items():


            # ignore metric words
            if normalized_value in IGNORE_WORDS:
                continue



            # exact word match only
            if contains_word(question, normalized_value):

                filters[column] = original_value



    # Extract year

    year_match = re.search(
        r"\b(19|20)\d{2}\b",
        question
    )


    if year_match and "Year" in filter_values:

        year = year_match.group()

        filters["Year"] = int(year)



    print("QUESTION:", question)

    print("EXTRACTED FILTERS:", filters)


    return filters