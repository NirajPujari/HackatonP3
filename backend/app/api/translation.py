from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from app.services.translator import translate_multi

router = APIRouter()

class TranslationRequest(BaseModel):
    word: str

class TranslationResponse(BaseModel):
    word: str
    translations: Dict[str, str]


@router.post("/", response_model=TranslationResponse)
async def perform_translation(request: TranslationRequest):
    """
    POST /translate endpoint.
    Retrieves languages and translates the word (with cache and normalization).
    """
    result = translate_multi(request.word)
    return TranslationResponse(
        word=result["word"],
        translations=result["translations"]
    )