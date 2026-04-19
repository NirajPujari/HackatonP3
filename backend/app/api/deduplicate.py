from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Any
from app.services.agent import deduplication_agent

router = APIRouter()

class DeDuplicateRequest(BaseModel):
    word: str

class DuplicateResult(BaseModel):
    name: str
    lang: str
    confidence: float
    match_type: str

class SummaryResult(BaseModel):
    total_found: int
    high_confidence: int
    low_confidence: int

class DeDuplicateResponse(BaseModel):
    input_word: str
    matched_by_layer: int
    llm_calls_made: bool
    duplicates_found: List[DuplicateResult]
    duplicate_languages: List[str]
    summary: SummaryResult

@router.post("/", response_model=DeDuplicateResponse)
async def perform_deduplication(request: DeDuplicateRequest):
    """
    POST /deduplicate endpoint.
    Runs the agent loop to find duplicates across translated terms.
    """
    result = deduplication_agent(request.word)
    return DeDuplicateResponse(**result)