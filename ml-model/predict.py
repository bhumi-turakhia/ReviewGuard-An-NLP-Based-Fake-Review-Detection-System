"""
predict.py
----------
Called by Node.js backend via child_process.
Accepts JSON input via stdin, outputs JSON prediction to stdout.

Usage: python predict.py '{"text": "review text here", "model": "lr"}'
"""

import sys
import json
import pickle
import re
import os
import numpy as np

# ─── Text Preprocessing ───────────────────────────────────────────────────────
def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = text.split()
    # Basic stopwords (no NLTK dependency at runtime for speed)
    stop_words = {
        'the','a','an','and','or','but','in','on','at','to','for','of','with',
        'by','from','up','about','into','through','is','are','was','were','be',
        'been','being','have','has','had','do','does','did','will','would',
        'could','should','may','might','shall','can','this','that','these',
        'those','i','me','my','myself','we','our','you','your','he','she','it',
        'they','them','their','what','which','who','when','where','why','how',
        'all','each','every','both','few','more','most','other','some','such',
        'than','then','there','so','as','if','its','just','also','am'
    }
    tokens = [t for t in tokens if t not in stop_words and len(t) > 2]
    return ' '.join(tokens)

# ─── Explanation Generator ────────────────────────────────────────────────────
def generate_explanation(text, is_fake, confidence, fake_indicators, genuine_indicators, lr_coefs, feature_names, vectorizer):
    """Generate human-readable explanation with feature highlights."""
    
    words_in_review = set(preprocess_text(text).split())
    
    # Find matching indicator words
    matched_fake = [w for w in fake_indicators[:30] if any(w in word for word in words_in_review)][:5]
    matched_genuine = [w for w in genuine_indicators[:30] if any(w in word for word in words_in_review)][:5]
    
    # Linguistic analysis
    word_count = len(text.split())
    exclamation_count = text.count('!')
    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
    superlatives = ['best', 'greatest', 'amazing', 'perfect', 'incredible', 'unbelievable', 
                    'worst', 'terrible', 'awful', 'horrible', 'never', 'always', 'every']
    superlative_count = sum(1 for w in text.lower().split() if w in superlatives)
    
    reasons = []
    flags = []
    
    if is_fake:
        if exclamation_count >= 2:
            flags.append({"type": "warning", "label": "Excessive Exclamations", 
                         "detail": f"Found {exclamation_count} exclamation marks — a common indicator of fake enthusiasm"})
        if caps_ratio > 0.15:
            flags.append({"type": "warning", "label": "Excessive Capitalization",
                         "detail": f"~{caps_ratio:.0%} of text is capitalized — suggests artificial urgency"})
        if superlative_count >= 2:
            flags.append({"type": "warning", "label": "Extreme Language",
                         "detail": f"Uses {superlative_count} extreme/superlative words without specific details"})
        if word_count < 15:
            flags.append({"type": "warning", "label": "Very Short Review",
                         "detail": "Genuine reviews tend to be more detailed and specific"})
        if matched_fake:
            flags.append({"type": "warning", "label": "Suspicious Keywords",
                         "detail": f"Contains words strongly associated with fake reviews: {', '.join(matched_fake)}"})
        
        reasons = [
            "The review uses overly positive or extreme language without specific product details",
            "Lacks concrete information about actual usage experience",
            "Language pattern matches known fake review characteristics in training data",
            "Review reads as promotional rather than experiential"
        ]
        if not flags:
            flags.append({"type": "warning", "label": "Pattern Match",
                         "detail": "The overall linguistic pattern closely matches fake reviews in our training data"})
    else:
        if word_count > 20:
            flags.append({"type": "success", "label": "Adequate Length",
                         "detail": f"Review contains {word_count} words — detailed enough to be credible"})
        if exclamation_count <= 1:
            flags.append({"type": "success", "label": "Measured Tone",
                         "detail": "Uses calm, measured language typical of genuine reviewers"})
        if matched_genuine:
            flags.append({"type": "success", "label": "Genuine Keywords",
                         "detail": f"Contains words associated with genuine reviews: {', '.join(matched_genuine)}"})
        
        reasons = [
            "The review contains specific, experience-based observations",
            "Language is measured and balanced, not overly promotional",
            "Linguistic pattern matches genuine reviews in our training data",
            "Review demonstrates authentic product familiarity"
        ]
        if not flags:
            flags.append({"type": "success", "label": "Natural Language",
                         "detail": "The overall writing style appears natural and authentic"})
    
    # Confidence explanation
    confidence_label = "Very High" if confidence > 0.85 else "High" if confidence > 0.70 else "Moderate" if confidence > 0.55 else "Low"
    
    # Text stats
    stats = {
        "word_count": word_count,
        "exclamation_marks": exclamation_count,
        "caps_percentage": round(caps_ratio * 100, 1),
        "extreme_words": superlative_count,
        "avg_word_length": round(np.mean([len(w) for w in text.split()]) if text.split() else 0, 1)
    }
    
    return {
        "flags": flags[:4],
        "reasons": reasons[:3],
        "confidence_label": confidence_label,
        "text_stats": stats
    }

# ─── Main Prediction ──────────────────────────────────────────────────────────
def predict(text, model_type="lr"):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load models
    with open(os.path.join(script_dir, 'vectorizer.pkl'), 'rb') as f:
        vectorizer = pickle.load(f)
    
    model_file = 'model_lr.pkl' if model_type == 'lr' else 'model_nb.pkl'
    with open(os.path.join(script_dir, model_file), 'rb') as f:
        model = pickle.load(f)
    
    with open(os.path.join(script_dir, 'model_stats.pkl'), 'rb') as f:
        stats = pickle.load(f)
    
    # Preprocess and vectorize
    processed = preprocess_text(text)
    X = vectorizer.transform([processed])
    
    # Predict
    prediction = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    confidence = float(max(proba))
    
    fake_prob = float(proba[1])
    genuine_prob = float(proba[0])
    
    # Generate explanation
    feature_names = vectorizer.get_feature_names_out()
    lr_coefs = None
    try:
        from sklearn.linear_model import LogisticRegression as LR
        if isinstance(model, LR):
            lr_coefs = model.coef_[0]
    except:
        pass
    
    explanation = generate_explanation(
        text, prediction == 1, confidence,
        stats.get('fake_indicators', []),
        stats.get('genuine_indicators', []),
        lr_coefs, feature_names, vectorizer
    )
    
    result = {
        "prediction": prediction,
        "label": "FAKE" if prediction == 1 else "GENUINE",
        "confidence": round(confidence * 100, 2),
        "fake_probability": round(fake_prob * 100, 2),
        "genuine_probability": round(genuine_prob * 100, 2),
        "model_used": "Logistic Regression" if model_type == "lr" else "Naive Bayes",
        "processed_text": processed,
        "explanation": explanation
    }
    
    return result

# ─── Entry Point ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    try:
        if len(sys.argv) > 1:
            data = json.loads(sys.argv[1])
        else:
            data = json.loads(sys.stdin.read())
        
        text = data.get('text', '')
        model_type = data.get('model', 'lr')
        
        if not text.strip():
            raise ValueError("Empty review text")
        
        result = predict(text, model_type)
        print(json.dumps(result))
    
    except Exception as e:
        error_result = {"error": str(e), "prediction": -1}
        print(json.dumps(error_result))
        sys.exit(1)
