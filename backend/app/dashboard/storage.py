import json
import uuid
from pathlib import Path
from datetime import datetime

# -----------------------------
# Storage Location
# -----------------------------
DATA_FILE = (
    Path(__file__)
    .parent.parent
    / "data"
    / "dashboards.json"
)

DATA_FILE.parent.mkdir(
    exist_ok=True
)

if not DATA_FILE.exists():
    DATA_FILE.write_text("[]")


# -----------------------------
# Read Database
# -----------------------------
def _read():
    """
    Read dashboard storage safely.
    Returns an empty list if the file is empty or invalid.
    """

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:

            content = f.read().strip()

            if not content:
                return []

            return json.loads(content)

    except (json.JSONDecodeError, FileNotFoundError):
        return []


# -----------------------------
# Write Database
# -----------------------------
def _write(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(
            data,
            f,
            indent=4,
            ensure_ascii=False
        )


# -----------------------------
# Save Dashboard
# -----------------------------
def save_dashboard(name: str, dashboard: dict):

    dashboards = _read()

    dashboard_record = {
        "id": str(uuid.uuid4()),
        "name": name,
        "created_at": datetime.now().isoformat(),
        "dashboard": dashboard
    }

    dashboards.append(
        dashboard_record
    )

    _write(dashboards)

    return dashboard_record


# -----------------------------
# List Dashboards
# -----------------------------
def list_dashboards():

    return _read()


# -----------------------------
# Get Dashboard
# -----------------------------
def get_dashboard(dashboard_id: str):

    dashboards = _read()

    for dashboard in dashboards:

        if dashboard["id"] == dashboard_id:
            return dashboard

    return None


# -----------------------------
# Delete Dashboard
# -----------------------------
def delete_dashboard(dashboard_id: str):

    dashboards = _read()

    dashboards = [
        dashboard
        for dashboard in dashboards
        if dashboard["id"] != dashboard_id
    ]

    _write(dashboards)