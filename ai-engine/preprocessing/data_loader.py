import pandas as pd  # type: ignore
import os

def load_raw_data(data_dir='data/raw'):
    """Loads raw CSV files from the data directory."""
    print("Loading datasets...")
    
    books_path = os.path.join(data_dir, 'Books.csv')
    users_path = os.path.join(data_dir, 'Users.csv')
    ratings_path = os.path.join(data_dir, 'Ratings.csv')
    
    books = pd.read_csv(books_path, sep=',', on_bad_lines='skip', encoding="latin-1", low_memory=False)
    users = pd.read_csv(users_path, sep=',', on_bad_lines='skip', encoding="latin-1", low_memory=False)
    ratings = pd.read_csv(ratings_path, sep=',', on_bad_lines='skip', encoding="latin-1", low_memory=False)
    
    return books, users, ratings

def clean_books(books):
    """Performs initial cleaning on the books dataset."""
    print("Cleaning books...")
    # Select relevant columns
    books = books[['ISBN', 'Book-Title', 'Book-Author', 'Year-Of-Publication', 'Publisher', 'Image-URL-L']]
    
    # Strip whitespace from ISBN
    books['ISBN'] = books['ISBN'].str.strip()
    books.rename(columns={
        'Book-Title': 'title',
        'Book-Author': 'author',
        'Year-Of-Publication': 'year',
        'Publisher': 'publisher',
        'Image-URL-L': 'image_url'
    }, inplace=True)
    
    # Handle missing values
    books.dropna(inplace=True)
    
    # Remove duplicates
    books.drop_duplicates(subset='ISBN', inplace=True)
    
    return books

def clean_users(users):
    """Performs initial cleaning on the users dataset."""
    print("Cleaning users...")
    users.rename(columns={'User-ID': 'user_id', 'Location': 'location', 'Age': 'age'}, inplace=True)
    return users

def clean_ratings(ratings):
    """Performs initial cleaning on the ratings dataset."""
    print("Cleaning ratings...")
    ratings.rename(columns={'User-ID': 'user_id', 'Book-Rating': 'rating'}, inplace=True)
    
    # Strip whitespace from ISBN
    ratings['ISBN'] = ratings['ISBN'].str.strip()
    ratings = ratings[ratings['rating'] != 0]
    
    return ratings
