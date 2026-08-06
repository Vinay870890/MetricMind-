from fastapi import APIRouter
from pydantic import BaseModel

from app.dashboard.storage import (
    save_dashboard,
    list_dashboards,
    get_dashboard,
    delete_dashboard,
)

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


class DashboardRequest(BaseModel):
    name: str
    dashboard: dict


@router.post("/save")
def save_dashboard_api(request: DashboardRequest):
    """
    Save dashboard.
    """

    dashboard = save_dashboard(
        request.name,
        request.dashboard
    )

    return {
        "status": "success",
        "message": "Dashboard saved successfully.",
        "dashboard": dashboard
    }


@router.get("/list")
def list_dashboard_api():
    """
    List all dashboards.
    """

    return {
        "status": "success",
        "count": len(list_dashboards()),
        "dashboards": list_dashboards()
    }


@router.get("/{dashboard_id}")
def get_dashboard_api(dashboard_id: str):
    """
    Get dashboard by ID.
    """

    dashboard = get_dashboard(dashboard_id)

    if dashboard is None:
        return {
            "status": "error",
            "message": "Dashboard not found."
        }

    return {
        "status": "success",
        "dashboard": dashboard
    }


@router.delete("/{dashboard_id}")
def delete_dashboard_api(dashboard_id: str):
    """
    Delete dashboard.
    """

    delete_dashboard(dashboard_id)

    return {
        "status": "success",
        "message": "Dashboard deleted successfully."
    }