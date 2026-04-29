"""
get_stats.py
------------
Returns model statistics as JSON. Called by Node.js backend.
"""

import sys
import json
import pickle
import os

def get_stats():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    stats_path = os.path.join(script_dir, 'model_stats.pkl')
    
    if not os.path.exists(stats_path):
        return {"error": "Model not trained yet. Run train_model.py first."}
    
    with open(stats_path, 'rb') as f:
        stats = pickle.load(f)
    
    return stats

if __name__ == '__main__':
    result = get_stats()
    print(json.dumps(result))
