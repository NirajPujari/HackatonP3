from fastapi import APIRouter
from app.services.cache_warmer import warm_cache, get_cache_stats

router = APIRouter()

@router.post("/warmup")
def warmup_cache_endpoint():
    """Endpoint to trigger the translation cache warmup process."""
    result = warm_cache()
    return result

@router.get("/stats")
def cache_stats_endpoint():
    """Endpoint to get statistics on the translation cache."""
    result = get_cache_stats()
    return result
