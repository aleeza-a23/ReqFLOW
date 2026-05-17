from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import numpy as np
import joblib
from datetime import datetime
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import os
nltk.download('stopwords', quiet=True)

app = Flask(__name__)
CORS(app)

recent_classifications = []

def load_model_components():
    """Load the trained model and all components"""
    try:
        model = joblib.load('requirement_classifier.pkl')
        tfidf = joblib.load('tfidf_vectorizer.pkl')
        selector = joblib.load('feature_selector.pkl')
        top_indices = joblib.load('top_indices.pkl')
        stop_words = joblib.load('stop_words.pkl')
        stemmer = joblib.load('stemmer.pkl')
        print(" All model components loaded successfully!")
        return model, tfidf, selector, top_indices, stop_words, stemmer
    except Exception as e:
        print(f" Error loading model: {e}")
        print("Please run IDS_Project.py first to generate model files")
        return None, None, None, None, None, None

print("\n Loading model components...")
model, tfidf, selector, top_indices, stop_words, stemmer = load_model_components()

def preprocess_text(text, stop_words, stemmer):
    """Clean and preprocess user input - SAME as training"""
    text = text.lower()

    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    text = re.sub(r'\s+', ' ', text).strip()

    tokens = text.split()

    tokens = [w for w in tokens if w not in stop_words and len(w) > 1]

    tokens = [stemmer.stem(w) for w in tokens]
    return ' '.join(tokens)

def predict_requirement(text):
    """Predict if requirement is Functional or Non-Functional"""

    cleaned = preprocess_text(text, stop_words, stemmer)

    vec = tfidf.transform([cleaned])
    
    vec_selected = selector.transform(vec)
    vec_final = vec_selected[:, top_indices]
    
    pred = model.predict(vec_final)[0]
    prob = model.predict_proba(vec_final)[0]
    
    confidence = max(prob) * 100
    functional_prob = prob[1] * 100
    nonfunctional_prob = prob[0] * 100
    
    return pred, confidence, functional_prob, nonfunctional_prob

@app.route('/api/classify', methods=['POST'])
def classify():
    """Classify a software requirement"""
    try:
        data = request.json
        requirement = data.get('requirement', '')
        
        if not requirement.strip():
            return jsonify({'error': 'Please enter a requirement'}), 400
        
        pred, confidence, func_prob, nonfunc_prob = predict_requirement(requirement)
        
        result = {
            'requirement': requirement,
            'prediction': 'FUNCTIONAL' if pred == 1 else 'NON-FUNCTIONAL',
            'confidence': round(confidence, 2),
            'functional_prob': round(func_prob, 2),
            'nonfunctional_prob': round(nonfunc_prob, 2),
            'timestamp': datetime.now().isoformat()
        }
        
        recent_classifications.insert(0, result)
        if len(recent_classifications) > 10:
            recent_classifications.pop()
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recent', methods=['GET'])
def get_recent():
    """Get recent classifications"""
    return jsonify(recent_classifications), 200

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy', 
        'model_loaded': model is not None,
        'recent_count': len(recent_classifications)
    }), 200

@app.route('/api/recent', methods=['DELETE'])
def delete_all_recent():
    """Delete all recent classifications"""
    try:
        recent_classifications.clear()
        return jsonify({'message': 'All recent classifications deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recent/<int:index>', methods=['DELETE'])
def delete_recent_by_index(index):
    """Delete a specific recent classification by index"""
    try:
        if 0 <= index < len(recent_classifications):
            deleted_item = recent_classifications.pop(index)
            return jsonify({'message': 'Classification deleted successfully', 'deleted': deleted_item}), 200
        else:
            return jsonify({'error': 'Classification not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    print(" Starting Flask API Server...")
    if model is None:
        print("  WARNING: Model not loaded. Please run IDS_Project.py first!")
    else:
        print(" Model loaded and ready!")
    print(" Server running on: http://localhost:5000")
    app.run(debug=True, port=5000)