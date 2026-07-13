from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Add the current directory to sys.path to allow imports from api and preprocessing
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.recommend import Recommender

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the recommender
# It will load the models from the 'models' directory
recommender = Recommender(models_dir=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models')))

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    
    if not data or 'book_title' not in data:
        return jsonify({'error': 'Please provide a book_title in the request body.'}), 400
    
    book_title = data['book_title']
    print(f"Received request for book: {book_title}")
    
    recommendations = recommender.recommend(book_title)
    
    if isinstance(recommendations, str) and recommendations.startswith("Error"):
        return jsonify({'error': recommendations}), 404
    
    return jsonify({
        'book_title': book_title,
        'recommendations': recommendations
    })

@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'ready',
        'model_loaded': recommender.book_pivot is not None
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
