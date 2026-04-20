from app.services.translator import translate_multi
from app.services.db import search_duplicates, get_all_languages, get_collection
from app.services.normalize import normalize_word
from app.services.matcher import layer1_fuzzy_match, layer2_transliteration_match
from collections import Counter
from anyascii import anyascii
import Levenshtein
from rapidfuzz import fuzz


def score_llm_match(
    input_word: str,
    translated_word: str,
    db_record_name: str,
    came_from_cache: bool,
    llm_output_raw: str,
) -> dict:
    t_norm = normalize_word(translated_word)
    d_norm = normalize_word(db_record_name)

    if t_norm.lower() == d_norm.lower():
        return {"confidence": 1.0, "match_type": "exact"}

    t_ascii = anyascii(translated_word).lower()
    i_ascii = anyascii(input_word).lower()

    dist = Levenshtein.distance(t_ascii, i_ascii)
    if dist <= 2:
        return {
            "confidence": 0.75 if dist <= 1 else 0.60,
            "match_type": "transliteration",
        }

    hedges = [
        "unavailable",
        "approximately",
        "similar to",
        "not available",
        "no translation",
        "unknown",
        "n/a",
    ]
    lower_llm_output = llm_output_raw.lower()
    if not any(h in lower_llm_output for h in hedges):
        return {
            "confidence": 0.95 if came_from_cache else 0.85,
            "match_type": "semantic",
        }

    similarity = fuzz.ratio(t_norm, d_norm) / 100.0
    conf = 0.40 + (0.19 * similarity)
    return {"confidence": round(conf, 4), "match_type": "fuzzy"}


def _build_summary(duplicates_found: list) -> dict:
    total = len(duplicates_found)
    high = sum(1 for d in duplicates_found if d["confidence"] >= 0.85)
    low = sum(1 for d in duplicates_found if d["confidence"] < 0.85)
    return {"total_found": total, "high_confidence": high, "low_confidence": low}


def deduplication_agent(input_word: str):
    """
    Agent loop to translate and find duplicates.
    Max 5 iterations.
    """
    all_records = get_collection("data")

    # Check if the word is Latin (including extended Latin characters).
    # Non-Latin scripts like Cyrillic, Arabic, Devanagari will have ord > 0x024F.
    is_latin = all(
        ord(c) <= 0x024F for c in input_word.replace(" ", "").replace("-", "")
    )

    if is_latin:
        # Layer 1
        l1_results = layer1_fuzzy_match(input_word, all_records)
        if l1_results:
            return {
                "input_word": input_word,
                "matched_by_layer": 1,
                "llm_calls_made": False,
                "duplicates_found": l1_results,
                "duplicate_languages": list(
                    set(d["lang"] for d in l1_results if d.get("lang"))
                ),
                "summary": _build_summary(l1_results),
            }

    # Layer 2
    l2_results = layer2_transliteration_match(input_word, all_records)
    if l2_results:
        return {
            "input_word": input_word,
            "matched_by_layer": 2,
            "llm_calls_made": False,
            "duplicates_found": l2_results,
            "duplicate_languages": list(
                set(d["lang"] for d in l2_results if d.get("lang"))
            ),
            "summary": _build_summary(l2_results),
        }

    # Layer 3
    llm_calls_made = True
    normalized_input = normalize_word(input_word)
    languages = get_all_languages()

    current_translations = {}
    failed_langs = list(languages)
    retry_identical_done = False

    for iteration in range(5):
        if iteration == 0:
            result = translate_multi(normalized_input, languages)
            current_translations = result["translations"]
        else:
            if failed_langs:
                retry_results = translate_multi(normalized_input, failed_langs)
                current_translations.update(retry_results["translations"])

        unique_results = [
            v["translation"]
            for k, v in current_translations.items()
            if "unavailable" not in v["translation"].lower()
        ]
        failed_langs = [
            k
            for k, v in current_translations.items()
            if "unavailable" in v["translation"].lower()
        ]

        if unique_results and not retry_identical_done:
            counts = Counter(unique_results)
            most_common_word, count = counts.most_common(1)[0]
            if len(unique_results) > 2 and (count / len(unique_results)) > 0.7:
                retry_identical_done = True
                result = translate_multi(normalized_input, languages)
                current_translations = result["translations"]
                unique_results = [
                    v["translation"]
                    for k, v in current_translations.items()
                    if "unavailable" not in v["translation"].lower()
                ]
                failed_langs = [
                    k
                    for k, v in current_translations.items()
                    if "unavailable" in v["translation"].lower()
                ]

        all_words_to_check = {normalized_input} | set(unique_results)
        duplicates = search_duplicates(list(all_words_to_check))

        if duplicates:
            break

        if not failed_langs and (retry_identical_done or iteration > 0):
            break

    duplicate_langs = []
    formatted_duplicates = []

    if duplicates:
        duplicate_names = {doc["name"].lower(): doc for doc in duplicates}

        # Check original first
        if normalized_input in duplicate_names:
            dup_doc = duplicate_names[normalized_input]
            duplicate_langs.append("Original")
            score = score_llm_match(
                input_word, normalized_input, dup_doc["name"], False, normalized_input
            )
            formatted_duplicates.append(
                {
                    "name": dup_doc["name"],
                    "lang": dup_doc.get("lang", ""),
                    "confidence": score["confidence"],
                    "match_type": score["match_type"],
                }
            )

        # Check translations
        for lang, trans_info in current_translations.items():
            trans_word = trans_info["translation"]
            if trans_word.lower() in duplicate_names:
                duplicate_langs.append(lang)
                dup_doc = duplicate_names[trans_word.lower()]

                score = score_llm_match(
                    input_word=input_word,
                    translated_word=trans_word,
                    db_record_name=dup_doc["name"],
                    came_from_cache=trans_info.get("cache_hit", False),
                    llm_output_raw=trans_word,
                )

                # Check if we already added this doc to prevent duplicates in the list
                if not any(
                    fd["name"] == dup_doc["name"]
                    and fd["lang"] == dup_doc.get("lang", "")
                    for fd in formatted_duplicates
                ):
                    formatted_duplicates.append(
                        {
                            "name": dup_doc["name"],
                            "lang": dup_doc.get("lang", ""),
                            "confidence": score["confidence"],
                            "match_type": score["match_type"],
                        }
                    )

    return {
        "input_word": input_word,
        "matched_by_layer": 3,
        "llm_calls_made": llm_calls_made,
        "duplicates_found": formatted_duplicates,
        "duplicate_languages": list(set(duplicate_langs)),
        "summary": _build_summary(formatted_duplicates),
    }
