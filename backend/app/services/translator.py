import json
import os
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from app.services.db import get_all_languages, get_cached_translation, cache_translation
from app.services.normalize import normalize_word
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")
API_URL = os.getenv("URL")
MODEL = os.getenv("MODEL")

def translate(word: str, lang: str, delay: int = 0.5):
    """Worker Agent: Translates a word to a target language with retry logic and caching."""
    # Normalization
    normalized_word = normalize_word(word)
    
    # Check Cache
    cached = get_cached_translation(normalized_word, lang)
    if cached:
        return {"translation": cached["translated_word"], "cache_hit": True}

    max_retries = 10
    
    prompt = f"""
        You are a professional human name translator.

        Task: Translate the given personal name into {lang}.

        Input: {normalized_word}

        Rules:
        - Output ONLY the translated name.
        - No quotes, no punctuation, no explanations.
        - Preserve meaning, not literal spelling where inappropriate.
        - Use the natural/native form of the name in {lang}.
        - If an established equivalent exists, use it (e.g., Ivan ↔ Иван).
        - If no direct equivalent exists, transliterate appropriately.
        - Maintain proper capitalization for the target language.
        - Output a single result only.
    """
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }

    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers=headers, data=json.dumps(payload), timeout=10)
            response.raise_for_status()
            data = response.json()
            
            raw_translation = data["choices"][0]["message"]["content"]
            translated_word = normalize_word(raw_translation)
            
            if translated_word:
                cache_translation(normalized_word, lang, translated_word)
                return {"translation": translated_word, "cache_hit": False}
        
        except Exception as e:
            print(f"Attempt {attempt + 1} failed for {lang}: {e}")
            if attempt < max_retries - 1:
                time.sleep(delay)
    
    return {"translation": "Translation unavailable", "cache_hit": False} 

def translate_multi(word: str, languages: list = None, delay: int = 0.5):
    """Head Agent: Orchestrates parallel translation tasks."""
    if languages is None:
        languages = get_all_languages()
    
    if not languages:
        return {"word": word, "translations": {}}

    results = {}
    with ThreadPoolExecutor(max_workers=5) as executor:
        future_to_lang = {executor.submit(translate, word, lang, delay): lang for lang in languages}
        
        for future in as_completed(future_to_lang):
            lang = future_to_lang[future]
            try:
                results[lang] = future.result()
            except Exception as exc:
                results[lang] = {"translation": f"Translation unavailable {exc}", "cache_hit": False}

    return {
        "word": word,
        "translations": results
    }
