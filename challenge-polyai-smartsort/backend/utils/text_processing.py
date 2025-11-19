import re
from typing import List

def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\sàâäçéèêëïîôùûüÿæœ-]', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    return text

def extract_keywords(text: str) -> List[str]:
    stop_words = {
        'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 
        'est', 'sont', 'a', 'au', 'aux', 'dans', 'pour', 'par', 'sur',
        'avec', 'sans', 'sous', 'je', 'tu', 'il', 'elle', 'nous', 'vous',
        'ils', 'elles', 'mon', 'ton', 'son', 'ma', 'ta', 'sa', 'mes',
        'tes', 'ses', 'ce', 'cet', 'cette', 'ces', 'qui', 'que', 'quoi'
    }
    
    text = preprocess_text(text)
    
    words = text.split()
    
    keywords = [word for word in words if word not in stop_words and len(word) > 2]
    
    return keywords

def normalize_text(text: str) -> str:
    replacements = {
        'à': 'a', 'â': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'ï': 'i', 'î': 'i',
        'ô': 'o', 'ö': 'o',
        'ù': 'u', 'û': 'u', 'ü': 'u',
        'ÿ': 'y',
        'ç': 'c',
        'æ': 'ae',
        'œ': 'oe'
    }
    
    for accented, normal in replacements.items():
        text = text.replace(accented, normal)
    
    return text

def validate_text(text: str) -> bool:
    if not text or len(text.strip()) == 0:
        return False
    
    if len(text.strip()) < 3:
        return False
    
    if len(text) > 500:
        return False
    
    return True

def get_text_features(text: str) -> dict:
    keywords = extract_keywords(text)
    
    return {
        'length': len(text),
        'word_count': len(text.split()),
        'keyword_count': len(keywords),
        'keywords': keywords,
        'has_numbers': bool(re.search(r'\d', text)),
        'avg_word_length': sum(len(word) for word in keywords) / len(keywords) if keywords else 0
    }