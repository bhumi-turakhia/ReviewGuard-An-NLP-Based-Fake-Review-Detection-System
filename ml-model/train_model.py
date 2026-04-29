"""
train_model.py
--------------
Trains Logistic Regression and Naive Bayes models on the fake review dataset.
Run this ONCE to generate the .pkl model files.
"""

import pandas as pd
import numpy as np
import pickle
import re
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK data
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)

# ─── Text Preprocessing ────────────────────────────────────────────────────────
def preprocess_text(text):
    """Clean and normalize review text."""
    if not isinstance(text, str):
        return ""
    # Lowercase
    text = text.lower()
    # Remove URLs
    text = re.sub(r'http\S+|www\S+', '', text)
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    # Remove punctuation and special characters
    text = re.sub(r'[^a-z\s]', '', text)
    # Tokenize
    tokens = text.split()
    # Remove stopwords (keep some sentiment words)
    stop_words = set(stopwords.words('english')) - {
        'not', 'no', 'never', 'very', 'too', 'but', 'however', 'although'
    }
    tokens = [t for t in tokens if t not in stop_words and len(t) > 2]
    return ' '.join(tokens)

# ─── Generate Synthetic Dataset (if real dataset not available) ──────────────
def generate_synthetic_data(n_samples=5000):
    """Generate realistic synthetic review data for demo purposes."""
    np.random.seed(42)
    
    genuine_templates = [
        "This product is really good quality. I've been using it for months and it works perfectly.",
        "Bought this for my daughter and she loves it. Great build quality, arrived on time.",
        "Excellent product. Does exactly what it says. The instructions were clear and setup was easy.",
        "Very sturdy and well made. The color matches the photos. Will definitely buy again.",
        "I had a small issue but customer service resolved it quickly. Good experience overall.",
        "Not perfect but does the job. A bit pricey but worth it for the quality.",
        "Used this for a month now. Some minor issues but generally satisfied with the purchase.",
        "Great value for money. The packaging was secure and delivery was fast.",
        "Works as described. My only complaint is the size is slightly smaller than expected.",
        "Solid product. I compared several options and this was the best choice for my needs.",
        "The quality surprised me. Much better than I expected at this price point.",
        "Five stars! My family uses this every day and we haven't had any problems.",
        "Decent product but instructions could be clearer. Took a while to figure out setup.",
        "Really happy with this purchase. Shipping was quick and item was well packaged.",
        "Good but not great. Works fine but feels a bit cheap compared to the price."
    ]
    
    fake_templates = [
        "AMAZING!!! BEST PRODUCT EVER!!! BUY NOW!!! YOU WON'T REGRET IT!!!",
        "Absolutely perfect in every way! Five stars! Everyone should own this product immediately!",
        "I bought this and my life completely changed overnight! Unbelievable results!",
        "This is the greatest product I have ever purchased in my entire life without exception!",
        "WOW WOW WOW! Cannot believe how incredible this is! Buy buy buy!!!",
        "Perfect product perfect price perfect shipping perfect everything PERFECT!!!",
        "I recommended this to all 50 of my friends and family members! Everyone loves it!",
        "Changed my life! Best purchase of 2024! Nothing comes close to this amazing product!",
        "100% satisfied! No complaints whatsoever! Absolutely flawless in every single way!",
        "Ordered 10 of these as gifts! Everyone was blown away! Incredible value unmatched quality!",
        "THE BEST PRODUCT ON THIS ENTIRE WEBSITE! I am completely obsessed with it!",
        "Speechless. Just speechless. Cannot find a single flaw. Perfect from start to finish.",
        "Just received mine and I'm already ordering three more for family members right now!",
        "Never written a review before but had to for this! Literally the best thing I own!",
        "STOP SCROLLING AND BUY THIS NOW. You will thank me later trust me on this!"
    ]
    
    reviews = []
    labels = []
    
    for _ in range(n_samples // 2):
        template = np.random.choice(genuine_templates)
        noise_words = ["actually", "though", "however", "bit", "slight", "minor", "overall"]
        words = template.split()
        if np.random.random() > 0.7 and len(words) > 5:
            insert_pos = np.random.randint(1, min(5, len(words)))
            words.insert(insert_pos, np.random.choice(noise_words))
        reviews.append(' '.join(words))
        labels.append(0)  # Genuine
    
    for _ in range(n_samples // 2):
        template = np.random.choice(fake_templates)
        reviews.append(template)
        labels.append(1)  # Fake
    
    indices = np.random.permutation(len(reviews))
    return [reviews[i] for i in indices], [labels[i] for i in indices]

# ─── Main Training Script ────────────────────────────────────────────────────
print("🔍 Loading dataset...")

dataset_path = "fake reviews dataset 2.csv"

try:
    df = pd.read_csv(dataset_path)
    print("✅ Dataset loaded successfully")
    print("Columns:", df.columns)

    # Correct column mapping
    text_col = "text_"
    label_col = "label"

    df = df[[text_col, label_col]].dropna()
    df.columns = ['text', 'label']

    # ✅ FIXED label conversion
    df['label'] = df['label'].map({
        'CG': 0,   # Genuine
        'OR': 1    # Fake
    })

    # Remove invalid rows
    df = df.dropna(subset=['label'])

    df['label'] = df['label'].astype(int)

    reviews = df['text'].tolist()
    labels = df['label'].tolist()

    print(f"✅ Loaded real dataset: {len(reviews)} reviews")

except Exception as e:
    print(f"❌ ERROR loading dataset: {e}")
    print("⚠️ Using synthetic data instead...")
    reviews, labels = generate_synthetic_data(8000)