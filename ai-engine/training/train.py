import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import os
import pickle
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from preprocessing.data_loader import load_raw_data, clean_books, clean_users, clean_ratings
from preprocessing.processor import process_data, create_pivot_table

def train_model():
    # 1. Load Data
    books_raw, users_raw, ratings_raw = load_raw_data()
    
    # 2. Clean Data
    books = clean_books(books_raw)
    users = clean_users(users_raw)
    ratings = clean_ratings(ratings_raw)
    
    # 3. Process Data
    processed_df = process_data(books, users, ratings)
    
    # 4. Create Pivot Table
    book_pivot = create_pivot_table(processed_df)
    
    # 5. Build Model
    print("Building KNN model...")
    book_sparse = csr_matrix(book_pivot)
    
    model = NearestNeighbors(algorithm='brute')
    model.fit(book_sparse)
    
    # 6. Save Model and Data
    print("Saving model and data...")
    if not os.path.exists('models'):
        os.makedirs('models')
        
    with open('models/book_pivot.pkl', 'wb') as f:
        pickle.dump(book_pivot, f)
        
    with open('models/knn_model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    with open('models/books.pkl', 'wb') as f:
        pickle.dump(books, f)
        
    print("Training complete! Model saved in 'models/'.")

if __name__ == "__main__":
    train_model()add ai-engine: KNN training pipeline
