from fastapi import APIRouter
from app.api.data import router as data_router
from app.api.translation import router as translation_router
from app.api.normalize import router as normalize_router
from app.api.deduplicate import router as deduplicate_router

router = APIRouter()

router.include_router(data_router, prefix="/db")
router.include_router(normalize_router, prefix="/normalize")
router.include_router(translation_router, prefix="/translate")
router.include_router(deduplicate_router, prefix="/deduplicate")

@router.get("/health")
def health_check():
    return {"status": "ok"}
