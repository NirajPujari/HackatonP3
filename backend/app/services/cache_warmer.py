import os
import json
import time
import requests
from datetime import datetime, timezone
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from app.services.db import get_db, get_collection
from app.services.normalize import normalize_word

API_KEY = os.getenv("API_KEY")
API_URL = os.getenv("URL")
MODEL = os.getenv("MODEL")

def _translate_single(word: str, lang: str):
    max_retries = 3
    prompt = f"""
        You are a professional human name translator.

        Task: Translate the given personal name into {lang}.

        Input: {word}

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
            return normalize_word(raw_translation)
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(0.5)
            else:
                raise e
    return None

def warm_cache() -> dict:
    db = get_db()
    
    # Step 1: Inventory
    # fetch all unique name values from data collection
    data_names = db["data"].distinct("name")
    
    # fetch all unique lang values from data collection
    langs_in_db = db["data"].distinct("lang")
    target_languages = set(lang for lang in langs_in_db if lang)
    
    # Chinese special case
    if "Chinese" in target_languages:
        target_languages.remove("Chinese")
        target_languages.add("Chinese_Simplified")
        target_languages.add("Chinese_Traditional")
        
    target_languages = list(target_languages)
    
    unique_names = [normalize_word(n) for n in data_names if n]
    unique_names = list(set(n for n in unique_names if n)) # unique and not empty
    
    existing_cache_docs = list(db["cache"].find({}, {"word": 1, "lang": 1, "_id": 0}))
    existing_pairs = set()
    for doc in existing_cache_docs:
        w = doc.get("word")
        l = doc.get("lang")
        if w and l:
            existing_pairs.add((w, l))
            
    missing_pairs = []
    for name in unique_names:
        for lang in target_languages:
            if (name, lang) not in existing_pairs:
                missing_pairs.append((name, lang))
                
    total_pairs_needed = len(target_languages) * len(unique_names)
    already_cached = len(existing_pairs)
    
    # Step 2: Batched Translation
    batch_size = 10
    newly_translated = 0
    failed = 0
    failed_pairs = []
    
    for i in range(0, len(missing_pairs), batch_size):
        batch = missing_pairs[i:i + batch_size]
        
        with ThreadPoolExecutor(max_workers=batch_size) as executor:
            future_to_pair = {
                executor.submit(_translate_single, word, lang): (word, lang)
                for (word, lang) in batch
            }
            
            for future in as_completed(future_to_pair):
                word, lang = future_to_pair[future]
                try:
                    translated_word = future.result()
                    if not translated_word:
                        failed += 1
                        failed_pairs.append({"word": word, "lang": lang, "reason": "Empty translation returned"})
                        continue
                        
                    # Step 4: Arabic normalization
                    if "Arabic" in lang:
                        translated_word = unicodedata.normalize('NFC', translated_word)
                        
                    # Step 3: Store Results
                    db["cache"].update_one(
                        {"word": word, "lang": lang},
                        {"$set": {
                            "translated_word": translated_word,
                            "source": "warmup",
                            "cached_at": datetime.now(timezone.utc)
                        }},
                        upsert=True
                    )
                    newly_translated += 1
                except Exception as exc:
                    print(f"Failed warmup for {word} to {lang}: {exc}")
                    failed += 1
                    failed_pairs.append({"word": word, "lang": lang, "reason": str(exc)})
                    
        time.sleep(0.5)
        
    return {
        "unique_names": len(unique_names),
        "target_languages": target_languages,
        "total_pairs_needed": total_pairs_needed,
        "already_cached": already_cached,
        "newly_translated": newly_translated,
        "failed": failed,
        "failed_pairs": failed_pairs
    }

def get_cache_stats() -> dict:
    db = get_db()
    
    total_cached_entries = db["cache"].count_documents({})
    
    data_names = db["data"].distinct("name")
    unique_names = [normalize_word(n) for n in data_names if n]
    unique_names = list(set(n for n in unique_names if n))
    total_names_in_data = len(unique_names)
    
    langs_in_db = db["data"].distinct("lang")
    target_languages = set(lang for lang in langs_in_db if lang)
    if "Chinese" in target_languages:
        target_languages.remove("Chinese")
        target_languages.add("Chinese_Simplified")
        target_languages.add("Chinese_Traditional")
        
    coverage_by_language = {}
    fully_covered_languages = []
    incomplete_languages = []
    
    for lang in target_languages:
        # Check how many of the unique names exist in cache for this lang
        # We can just count matching docs in cache
        cached_count = db["cache"].count_documents({
            "lang": lang,
            "word": {"$in": unique_names}
        })
        
        coverage_pct = (cached_count / total_names_in_data * 100) if total_names_in_data > 0 else 0
        coverage_by_language[lang] = {
            "cached": cached_count,
            "total": total_names_in_data,
            "coverage_pct": round(coverage_pct, 2)
        }
        
        if total_names_in_data > 0 and cached_count == total_names_in_data:
            fully_covered_languages.append(lang)
        else:
            incomplete_languages.append(lang)
            
    return {
        "total_cached_entries": total_cached_entries,
        "total_names_in_data": total_names_in_data,
        "coverage_by_language": coverage_by_language,
        "fully_covered_languages": fully_covered_languages,
        "incomplete_languages": incomplete_languages,
        "estimated_llm_calls_saved": total_cached_entries
    }
