from app.services.translator import translate_multi
from app.services.db import search_duplicates, get_all_languages
from app.services.normalize import normalize_word
from collections import Counter

def run_deduplication_agent(input_word: str):
    """
    Agent loop to translate and find duplicates.
    Max 5 iterations.
    """
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
        unique_results = [v for k, v in current_translations.items() if v != "Translation unavailable"]
        failed_langs = [k for k, v in current_translations.items() if v == "Translation unavailable"]
        
        if unique_results and not retry_identical_done:
            counts = Counter(unique_results)
            most_common_word, count = counts.most_common(1)[0]
            if len(unique_results) > 2 and (count / len(unique_results)) > 0.7:
                retry_identical_done = True
                result = translate_multi(normalized_input, languages)
                current_translations = result["translations"]
                unique_results = [v for k, v in current_translations.items() if v != "Translation unavailable"]
                failed_langs = [k for k, v in current_translations.items() if v == "Translation unavailable"]

        all_words_to_check = {normalized_input} | set(unique_results)
        duplicates = search_duplicates(list(all_words_to_check))
        
        if duplicates:
            break
        
        if not failed_langs and (retry_identical_done or iteration > 0):
            break

    duplicate_langs = []
    if duplicates:
        duplicate_names = {doc["name"].lower() for doc in duplicates}
        if normalized_input in duplicate_names:
            duplicate_langs.append("Original")
        for lang, trans in current_translations.items():
            if trans.lower() in duplicate_names:
                duplicate_langs.append(lang)

    return {
        "input_word": input_word,
        "translations": current_translations,
        "duplicates_found": duplicates,
        "duplicate_languages": list(set(duplicate_langs))
    }
