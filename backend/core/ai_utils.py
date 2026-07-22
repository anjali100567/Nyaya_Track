import json
import os
from django.conf import settings
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

_bns_data = None
_vectorizer = None
_tfidf_matrix = None

def _load_model():
    global _bns_data, _vectorizer, _tfidf_matrix
    if _bns_data is not None:
        return

    json_path = os.path.join(settings.BASE_DIR, 'core', 'bns_sections.json')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            _bns_data = json.load(f)
    except Exception:
        _bns_data = []

    if not _bns_data:
        return

    corpus = []
    for item in _bns_data:
        # Combine text for vectorization
        text = f"{item['title']} {item['short_description']} {' '.join(item['keywords'])}"
        corpus.append(text)

    _vectorizer = TfidfVectorizer(stop_words='english')
    _tfidf_matrix = _vectorizer.fit_transform(corpus)


def suggest_sections(description, top_n=3):
    _load_model()
    if not _bns_data or not _vectorizer:
        return []

    desc_vector = _vectorizer.transform([description])
    similarities = cosine_similarity(desc_vector, _tfidf_matrix).flatten()
    
    # Get top_n indices
    top_indices = similarities.argsort()[-top_n:][::-1]
    
    results = []
    for idx in top_indices:
        score = similarities[idx]
        if score > 0.05:  # small threshold
            results.append({
                "section_number": _bns_data[idx]["section_number"],
                "title": _bns_data[idx]["title"],
                "confidence_score": round(float(score), 2)
            })
            
    return results
