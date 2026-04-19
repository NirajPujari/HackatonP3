import unicodedata
from rapidfuzz import fuzz
from anyascii import anyascii
from typing import List, Dict

def _normalize_string(s: str) -> str:
    s = str(s).lower()
    # strip punctuation
    s = ''.join(c for c in s if not unicodedata.category(c).startswith('P'))
    # strip diacritics
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode()
    return s

def layer1_fuzzy_match(input_word: str, candidates: List[Dict]) -> List[Dict]:
    normalized_input = _normalize_string(input_word)
    results = []
    
    for candidate in candidates:
        name = candidate.get("name", "")
        if not name:
            continue
        
        normalized_cand = _normalize_string(name)
        score = fuzz.ratio(normalized_input, normalized_cand)
        
        if score >= 85:
            results.append({
                "name": name,
                "lang": candidate.get("lang", ""),
                "confidence": round(score / 100.0, 4),
                "match_type": "fuzzy"
            })
            
    return results

def layer2_transliteration_match(input_word: str, candidates: List[Dict]) -> List[Dict]:
    romanized_input = anyascii(input_word).lower()
    results = []
    
    for candidate in candidates:
        name = candidate.get("name", "")
        if not name:
            continue
            
        romanized_cand = anyascii(name).lower()
        score = fuzz.ratio(romanized_input, romanized_cand)
        
        if score >= 80:
            confidence = 0.75 if score >= 90 else 0.60
            results.append({
                "name": name,
                "lang": candidate.get("lang", ""),
                "confidence": confidence,
                "match_type": "transliteration"
            })
            
    return results
