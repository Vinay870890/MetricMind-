from fastapi import APIRouter, UploadFile, File

from app.utils.file_handler import save_uploaded_file
from app.services.dataset_service import generate_profile
from app.schemas.dataset import DatasetProfile

router = APIRouter(
    prefix="/api",
    tags=["Dataset Upload"]
)


@router.post("/upload", response_model=DatasetProfile)
async def upload_dataset(file: UploadFile = File(...)):
    file_path = save_uploaded_file(file)

    profile = generate_profile(file_path)

    return profile