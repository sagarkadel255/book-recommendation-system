import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Book } from '../types/book';
import { useAuth } from './AuthContext';
import { toggleFavorite, getFavorites } from '../services/favoriteService';

interface LibraryContextType {
  savedBooks: Book[];
  addBook: (book: Book) => void;
  removeBook: (isbn: string) => void;
  isBookSaved: (isbn: string) => boolean;
  toggleBook: (book: Book) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const STORAGE_KEY = 'booknest_library';

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [savedBooks, setSavedBooks] = useState<Book[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBooks));
  }, [savedBooks]);

  useEffect(() => {
    if (isAuthenticated) {
      getFavorites()
        .then((favorites) => {
          const serverBooks = favorites.map((f) => f.bookId).filter(Boolean);
          if (serverBooks.length > 0) {
            setSavedBooks((prev) => {
              const merged = [...prev];
              for (const sb of serverBooks) {
                if (!merged.some((b) => b.isbn === sb.isbn)) {
                  merged.push(sb);
                }
              }
              return merged;
            });
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const addBook = (book: Book) => {
    setSavedBooks((prev) => {
      if (prev.some((b) => b.isbn === book.isbn)) return prev;
      return [...prev, book];
    });
  };

  const removeBook = (isbn: string) => {
    setSavedBooks((prev) => prev.filter((b) => b.isbn !== isbn));
  };

  const isBookSaved = (isbn: string) => {
    return savedBooks.some((b) => b.isbn === isbn);
  };

  const toggleBook = async (book: Book) => {
    const wasSaved = isBookSaved(book.isbn);
    if (wasSaved) {
      removeBook(book.isbn);
    } else {
      addBook(book);
    }
    if (isAuthenticated) {
      try {
        await toggleFavorite(book.isbn);
      } catch {
        
        if (wasSaved) {
          addBook(book);
        } else {
          removeBook(book.isbn);
        }
      }
    }
  };

  return (
    <LibraryContext.Provider value={{ savedBooks, addBook, removeBook, isBookSaved, toggleBook }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
