import pickle
import numpy as np
import os
from difflib import SequenceMatcher

class Recommender:
    def __init__(self, models_dir='models'):
        self.models_dir = models_dir
        self.book_pivot = None
        self.model = None
        self.books = None
        self.load_models()

    def load_models(self):
        """Loads the trained models from the models directory."""
        print("Loading models...")
        try:
            with open(os.path.join(self.models_dir, 'book_pivot.pkl'), 'rb') as f:
                self.book_pivot = pickle.load(f)
            with open(os.path.join(self.models_dir, 'knn_model.pkl'), 'rb') as f:
                self.model = pickle.load(f)
            with open(os.path.join(self.models_dir, 'books.pkl'), 'rb') as f:
                self.books = pickle.load(f)
            print("Models loaded successfully.")
        except FileNotFoundError:
            print("Error: Model files not found. Please run training/train.py first.")
        except Exception as e:
            print(f"Error loading models: {e}")

    def find_similar_book(self, book_title, threshold=0.6):
        """Find a similar book title in the dataset using fuzzy matching."""
        if self.book_pivot is None:
            return None
        
        best_match = None
        best_score = threshold
        
        book_title_lower = book_title.lower()
        
        for idx_title in self.book_pivot.index:
            idx_title_lower = idx_title.lower()
            
            # Exact match (case-insensitive)
            if idx_title_lower == book_title_lower:
                return idx_title
            
            # Check if search term is in the title or title is in search term
            if book_title_lower in idx_title_lower or idx_title_lower in book_title_lower:
                similarity = SequenceMatcher(None, book_title_lower, idx_title_lower).ratio()
                if similarity > best_score:
                    best_match = idx_title
                    best_score = similarity
            
            # Fuzzy match on similarity
            similarity = SequenceMatcher(None, book_title_lower, idx_title_lower).ratio()
            if similarity > best_score:
                best_match = idx_title
                best_score = similarity
        
        return best_match

    def recommend(self, book_title):
        """Generates recommendations for a given book title."""
        if self.book_pivot is None or self.model is None:
            return "Error: Recommender models are not loaded."

        # Try to find the book (exact or fuzzy match)
        matched_title = book_title if book_title in self.book_pivot.index else self.find_similar_book(book_title)
        
        if matched_title is None:
            return f"Error: Book '{book_title}' not found in the dataset. The model requires an exact match for book titles from its training dataset. Try a precise title."
        
        print(f"Matched '{book_title}' to '{matched_title}'")
        
        book_id = np.where(self.book_pivot.index == matched_title)[0][0]
        distances, suggestions = self.model.kneighbors(
            self.book_pivot.iloc[book_id, :].values.reshape(1, -1), 
            n_neighbors=6
        )
        
        # Use a set to avoid duplicates
        seen_titles = {matched_title}
        recommendations = []
        
        for i in range(len(suggestions)):
            suggested_titles = self.book_pivot.index[suggestions[i]]
            for title in suggested_titles:
                if title not in seen_titles:
                    recommendations.append(title)
                    seen_titles.add(title)
        
        print(f"Found {len(recommendations)} unique recommendations")
        return recommendations

if __name__ == "__main__":
    # Test script
    # This assumes models are already trained
    try:
        rec = Recommender()
        title = '1st to Die: A Novel'
        print(f"Recommendations for '{title}':")
        print(rec.recommend(title))
    except Exception as e:
        print(f"Could not run test: {e}.")
