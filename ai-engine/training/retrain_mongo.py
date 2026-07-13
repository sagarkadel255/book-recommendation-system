import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import os
import pickle
import pandas as pd
from pymongo import MongoClient
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from preprocessing.data_loader import load_raw_data, clean_books, clean_users
from preprocessing.processor import process_data, create_pivot_table

def fetch_ratings_from_mongo(uri: str) -> pd.DataFrame:
    """Fetch all ratings from MongoDB and format them like the CSV data."""
    print("Connecting to MongoDB...")
    client = MongoClient(uri)
    db = client.get_default_database()
    ratings_collection = db['ratings']
    users_collection = db['users']
    books_collection = db['books']
    
    print("Fetching ratings, users, and books...")
    
    # We need: User-ID, ISBN, Book-Rating
    # In MongoDB, Rating schema has userId, bookId, rating
    
    ratings_data = list(ratings_collection.find({}, {"_id": 0, "userId": 1, "bookId": 1, "rating": 1}))
    
    # Needs lookup for actual User-ID string/number (if any) and ISBN
    # For now, MongoDB uses object Ids.
    # We will map user ObjectIds to string ids, and book ObjectIds to ISBNs
    
    if not ratings_data:
        print("No ratings found in MongoDB.")
        return pd.DataFrame(columns=['User-ID', 'ISBN', 'Book-Rating'])

    user_map = {str(u['_id']): str(u['_id']) for u in users_collection.find({}, {"_id": 1})}
    book_map = {str(b['_id']): b.get('isbn') for b in books_collection.find({}, {"_id": 1, "isbn": 1})}
    
    df_list = []
    for r in ratings_data:
        uid_str = str(r['userId'])
        bid_str = str(r['bookId'])
        isbn = book_map.get(bid_str)
        
        if uid_str in user_map and isbn:
            df_list.append({
                'User-ID': uid_str,
                'ISBN': isbn,
                'Book-Rating': r['rating']
            })
            
    df = pd.DataFrame(df_list)
    print(f"Fetched {len(df)} ratings from MongoDB.")
    return df

def retrain_model(mongo_uri: str):
    # 1. Load Data
    # For a hybrid approach, we still load books/users from raw data if they are not fully migrated,
    # or just use the raw data to seed the model
    books_raw, users_raw, _ = load_raw_data()
    
    # Replace ratings_raw with MongoDB ratings
    ratings_raw = fetch_ratings_from_mongo(mongo_uri)
    
    if ratings_raw.empty:
        print("Not enough data to retrain model from MongoDB alone yet. Skipping retrain.")
        return

    # 2. Clean Data
    books = clean_books(books_raw)
    users = clean_users(users_raw)
    
    # We mock clean_ratings because our mongo data is already clean, but we pass it anyway
    # Actually, clean_ratings expects certain types, let's ensure types are right
    ratings_raw['User-ID'] = pd.to_numeric(ratings_raw['User-ID'], errors='coerce') 
    # Mongoose ObjectIds are hex strings. We might need a hashing mechanism if the original recommender expects integers
    # Let's just hash the string to a large int to satisfy pd.to_numeric safely, or skip clean_ratings if it breaks.
    
    # For this pipeline, assuming we drop strings if it strictly needs int:
    ratings_raw['User-ID'] = ratings_raw['User-ID'].apply(lambda x: int(str(x)[:8], 16) if isinstance(x, str) else x)
    
    ratings = ratings_raw

    # 3. Process Data
    processed_df = process_data(books, users, ratings)
    
    if processed_df.empty:
        print("Processed dataframe is empty. Aborting retrain.")
        return
        
    # 4. Create Pivot Table
    book_pivot = create_pivot_table(processed_df)
    
    # 5. Build Model
    print("Building new KNN model...")
    book_sparse = csr_matrix(book_pivot)
    
    model = NearestNeighbors(algorithm='brute')
    model.fit(book_sparse)
    
    # 6. Save Model and Data
    models_dir = os.path.join(Path(__file__).parent.parent, 'models')
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
        
    with open(os.path.join(models_dir, 'book_pivot.pkl'), 'wb') as f:
        pickle.dump(book_pivot, f)
        
    with open(os.path.join(models_dir, 'knn_model.pkl'), 'wb') as f:
        pickle.dump(model, f)
        
    with open(os.path.join(models_dir, 'books.pkl'), 'wb') as f:
        pickle.dump(books, f)
        
    print("Retraining complete! Model updated in 'models/'.")

if __name__ == "__main__":
    uri = os.getenv('MONGODB_URI', 'mongodb+srv://sagarkadel97_db_user:jPBh64BWL2qGTtP@cluster0.zf7bdqk.mongodb.net/booknest?retryWrites=true&w=majority')
    retrain_model(uri)
