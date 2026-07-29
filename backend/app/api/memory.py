from fastapi import APIRouter

from app.memory.session_memory import memory

router = APIRouter(
    prefix="/api",
    tags=["Memory"]
)


@router.get("/memory")
def get_memory():

    return {
        "count": len(memory.get_all()),
        "history": memory.get_all()
    }


@router.get("/memory/search")
def search_memory(keyword: str):

    results = memory.search(keyword)

    return {
        "keyword": keyword,
        "matches": len(results),
        "history": results
    }


@router.delete("/memory")
def clear_memory():

    memory.clear()

    return {
        "message": "Memory cleared successfully."
    }