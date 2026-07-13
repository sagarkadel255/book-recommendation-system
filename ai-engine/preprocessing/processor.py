import pandas as pd

def process_data(books, users, ratings, user_threshold=100, book_threshold=30):
    """
    Identifies active users and popular books, and merges datasets.
    """
    print(f"Processing data with thresholds: User > {user_threshold}, Book > {book_threshold}")
    
    # 1. Identify Active Users
    user_counts = ratings['user_id'].value_counts()
    active_users = user_counts[user_counts > user_threshold].index
    filtered_ratings = ratings[ratings['user_id'].isin(active_users)]
    print(f"Filtered to {len(active_users)} active users.")
    
    # 2. Merge with Books to get book titles
    ratings_with_books = filtered_ratings.merge(books, on='ISBN')
    
    # 3. Identify Popular Books
    book_counts = ratings_with_books.groupby('title').count()['rating']
    popular_books = book_counts[book_counts >= book_threshold].index
    
    final_ratings = ratings_with_books[ratings_with_books['title'].isin(popular_books)]
    print(f"Filtered to {len(popular_books)} popular books.")
    
    # 4. Remove duplicates if any (same user rating same book title multiple times)
    final_ratings = final_ratings.drop_duplicates(['user_id', 'title'])
    
    return final_ratings

def create_pivot_table(df):
    """Creates a pivot table for the recommendation model."""
    print("Creating pivot table...")
    pivot_table = df.pivot_table(index='title', columns='user_id', values='rating')
    pivot_table.fillna(0, inplace=True)
    return pivot_table
