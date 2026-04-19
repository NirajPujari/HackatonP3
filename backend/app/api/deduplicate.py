from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Any
from app.services.agent import run_deduplication_agent

router = APIRouter()

class DeDuplicateRequest(BaseModel):
    word: str

class DeDuplicateResponse(BaseModel):
    input_word: str
    translations: Dict[str, str]
    duplicates_found: List[Dict[str, Any]]
    duplicate_languages: List[str]

@router.post("/", response_model=DeDuplicateResponse)
async def perform_deduplication(request: DeDuplicateRequest):
    """
    POST /deduplicate endpoint.
    Runs the agent loop to find duplicates across translated terms.
    """
    result = run_deduplication_agent(request.word)
    return DeDuplicateResponse(**result)