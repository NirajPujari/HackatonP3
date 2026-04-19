import re

VALID_LANGS = {"English", "Hindi", "Kannada", "Russian", "Japanese"}

def normalize_doc(doc):
    try:
        # --- name ---
        name = doc.get("name")
        if not isinstance(name, str) or not name.strip():
            return None
        name = name.strip().lower()

        # --- lang ---
        lang = doc.get("lang")
        if lang not in VALID_LANGS:
            return None

        # --- salary ---
        salary = doc.get("salary")
        if isinstance(salary, str) and salary.isdigit():
            salary = int(salary)

        if not isinstance(salary, int) or salary < 0:
            return None

        # --- experience ---
        exp = doc.get("experience")
        if not isinstance(exp, int) or exp < 0:
            exp = 0

        # --- department ---
        dept = doc.get("department")
        if not isinstance(dept, str) or not dept.strip():
            dept = "Unknown"
        dept = dept.lower()

        return {
            "name": name,
            "lang": lang,
            "salary": salary,
            "experience": exp,
            "department": dept,
        }

    except Exception as e:
        print(f"Error normalizing document: {e}")
        return None

def normalize_word(word: str) -> str:
    """
    Normalizes a word:
    - lowercase
    - strip quotes (' and ")
    - remove trailing punctuation (.,!?;:)
    """
    if not word:
        return ""
    
    # Lowercase
    word = word.lower()
    
    # Strip quotes
    word = word.strip("'\"")
    
    # Remove trailing punctuation
    word = re.sub(r'[.,!?;:]+$', '', word)
    
    return word.strip()