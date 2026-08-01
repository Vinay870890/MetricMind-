from app.semantic.synonyms import METRIC_SYNONYMS


def normalize_metric(metric: str | None):
    """
    Convert business synonyms into governed metrics.
    """

    if metric is None:
        return None

    metric = metric.lower().strip()

    return METRIC_SYNONYMS.get(metric, metric)