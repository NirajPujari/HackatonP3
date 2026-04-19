from app.db import get_db

def get_collection(collection_name: str):
    """Returns a collection from the database."""
    db = get_db()
    data = db[collection_name].find()
    new_data = []
    for doc in data:
        doc['_id'] = str(doc['_id'])
        new_data.append(doc)
        
    return new_data

def get_all_languages():
    """Returns unique values of 'lang' from the employees collection."""
    db = get_db()
    languages = db["data"].distinct("lang")
    return [lang for lang in languages if lang]

def get_cached_translation(word: str, lang: str):
    """Retrieve translation from cache if it exists."""
    db = get_db()
    return db["cache"].find_one({"word": word, "lang": lang})

def cache_translation(word: str, lang: str, translated_word: str):
    """Store translation in cache, avoiding duplicates."""
    db = get_db()
    db["cache"].update_one(
        {"word": word, "lang": lang},
        {"$set": {"translated_word": translated_word}},
        upsert=True
    )

def search_duplicates(words: list):
    """Search 'data' collection for names matching any of the words (case-insensitive)."""
    db = get_db()
    
    # regex for each word to ensure case-insensitive exact match
    regex_list = [{"name": {"$regex": f"^{word}$", "$options": "i"}} for word in words]
    if not regex_list:
        return []
    
    cursor = db["data"].find({"$or": regex_list})
    results = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results
