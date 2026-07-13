import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiBookmark, FiChevronRight, FiStar } from 'react-icons/fi';
import StarRating from '../../components/StarRating';
import BookCard from '../../components/BookCard';
import { getBookByISBN, getRecommendedBooks } from '../../services/bookService';
import { addOrUpdateRating } from '../../services/ratingService';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { Book } from '../../types/book';

const FALLBACK_COVER = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <rect width="400" height="600" fill="#1A2A3A"/>
    <rect x="25" y="25" width="350" height="550" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="200" y="290" text-anchor="middle" font-family="Playfair Display, serif" font-weight="700" font-size="20" fill="#D4A853">NO COVER</text>
  </svg>`
)}`;

export default function BookDetailPage() {
  const { isbn } = useParams<{ isbn: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const { isBookSaved, toggleBook } = useLibrary();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBook = async () => {
      if (!isbn) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getBookByISBN(isbn);
        setBook(data);

        try {
          const recs = await getRecommendedBooks(8);
          setSimilarBooks(recs);
        } catch {
          setSimilarBooks([]);
        }
      } catch (e) {
        setError('Failed to load book details. The book may not exist or the server is unavailable.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [isbn]);

  const handleToggleSave = () => {
    if (!book) return;
    const wasSaved = isBookSaved(book.isbn);
    toggleBook(book);
    showToast(wasSaved ? 'Removed from your library' : 'Saved to your library', 'success');
  };

  const handleRate = async (rating: number) => {
    if (!book || !isAuthenticated) {
      showToast('Sign in to rate books', 'info');
      return;
    }
    try {
      setIsRatingSubmitting(true);
      await addOrUpdateRating(book.isbn, rating);
      setUserRating(rating);
      showToast(`You rated this book ${rating}/5`, 'success');
    } catch {
      showToast('Failed to submit rating', 'error');
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="section-container w-full min-h-[60vh] pt-24">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-96 aspect-[2/3] rounded-xl skeleton" />
          <div className="w-full md:w-2/3 flex flex-col gap-5">
            <div className="h-10 w-3/4 skeleton rounded-lg" />
            <div className="h-6 w-1/4 skeleton rounded-lg" />
            <div className="h-24 w-full skeleton rounded-lg mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] pt-24">
        <div className="text-center animate-fade-in px-4">
          <span className="text-label-md block mb-4" style={{ color: '#C94A4A' }}>ERROR</span>
          <h2 className="font-display text-headline-md mb-4" style={{ color: '#2C2420' }}>
            {error || 'Book not found'}
          </h2>
          <Link to="/" className="transition-colors font-medium" style={{ color: '#D4A853' }}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const saved = isBookSaved(book.isbn);

  const hasValidImage = book.imageUrl && book.imageUrl.length > 10 && !book.imageUrl.includes('1x1');
  const imageSrc = hasValidImage ? book.imageUrl : FALLBACK_COVER;

  return (
    <div className="w-full pb-16 pt-24 animate-fade-in">
      <div className="section-container">
        <nav className="flex items-center gap-2 text-body-sm mb-10 flex-wrap" style={{ color: '#8A7E75' }}>
          <Link to="/" className="hover:text-primary transition-colors shrink-0" style={{ textDecoration: 'none' }}>Home</Link>
          <FiChevronRight size={14} className="shrink-0" />
          <Link to="/explore" className="hover:text-primary transition-colors shrink-0" style={{ textDecoration: 'none' }}>Explore</Link>
          <FiChevronRight size={14} className="shrink-0" />
          <span className="truncate" style={{ color: '#2C2420' }}>{book.title}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          <div className="w-full md:w-96 flex-shrink-0">
            <div
              className="rounded-xl overflow-hidden relative animate-stagger"
              style={{
                animationDelay: '0ms',
                border: '1px solid #E8E2D8',
                backgroundColor: '#1A2A3A',
              }}
            >
              <img
                src={imageSrc}
                alt={`${book.title} by ${book.author}`}
                className="w-full h-auto aspect-[2/3] object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_COVER; }}
              />
            </div>
          </div>

          <div className="flex-grow min-w-0 animate-stagger" style={{ animationDelay: '100ms' }}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <span className="text-label-md mb-3 block" style={{ color: '#D4A853' }}>
                  {book.publisher || 'BOOK DETAILS'}
                </span>
                <h1 className="font-display text-headline-lg leading-tight" style={{ color: '#1A2A3A' }}>
                  {book.title}
                </h1>
              </div>

              <button
                onClick={handleToggleSave}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 text-label-sm font-medium ${
                  saved ? 'text-primary-dark' : 'text-text-secondary'
                }`}
                style={{
                  backgroundColor: saved ? '#D4A853' : '#FFFFFF',
                  border: saved ? 'none' : '1px solid #E8E2D8',
                }}
                aria-label={saved ? 'Remove from library' : 'Add to library'}
              >
                <FiBookmark size={15} />
                {saved ? 'Saved' : 'Save to Library'}
              </button>
            </div>

            <p className="text-body-lg mb-8" style={{ color: '#8A7E75' }}>
              by <span className="font-semibold" style={{ color: '#1A2A3A' }}>{book.author}</span>
            </p>

            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={book.rating} count={book.ratingCount} size={18} />
              <span className="text-body-sm" style={{ color: '#B0A79F' }}>
                {book.rating.toFixed(1)} / 10
              </span>
            </div>

            {isAuthenticated && (
              <div
                className="flex items-center gap-3 mb-8 p-4 rounded-xl"
                style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}
              >
                <FiStar size={16} style={{ color: '#D4A853' }} />
                <span className="text-body-sm font-medium" style={{ color: '#8A7E75' }}>
                  Your Rating:
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      disabled={isRatingSubmitting}
                      className="p-0.5 transition-all duration-150 hover:scale-110 bg-transparent border-none cursor-pointer disabled:opacity-50"
                      aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    >
                      <svg width="22" height="22" viewBox="0 0 20 20">
                        <path
                          d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.28l-4.77 2.44.91-5.33-3.87-3.77 5.34-.78L10 1z"
                          fill={star <= userRating ? '#D4A853' : '#E8E2D8'}
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <span className="text-label-sm" style={{ color: '#D4A853' }}>
                    {userRating}/5
                  </span>
                )}
              </div>
            )}

            <div
              className="p-8 rounded-xl mb-6"
              style={{
                backgroundColor: '#FAF6EF',
                border: '1px solid #E8E2D8',
              }}
            >
              <h3 className="font-display text-headline-sm mb-4" style={{ color: '#1A2A3A' }}>
                About This Book
              </h3>
              <p className="text-body-md leading-relaxed" style={{ color: '#5A5048' }}>
                {book.title} is a compelling read by {book.author}.
                {book.publisher && ` Published by ${book.publisher}`}
                {book.year && ` in ${book.year}.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {book.year && (
                <div className="px-4 py-2 rounded-full text-label-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', color: '#8A7E75' }}>
                  Published {book.year}
                </div>
              )}
              {book.publisher && (
                <div className="px-4 py-2 rounded-full text-label-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', color: '#8A7E75' }}>
                  {book.publisher}
                </div>
              )}
            </div>
          </div>
        </div>

        {similarBooks.length > 0 && (
          <div className="w-full mt-20 pt-16" style={{ borderTop: '1px solid #E8E2D8' }}>
            <span className="text-label-md block mb-3" style={{ color: '#D4A853' }}>
              YOU MAY ALSO LIKE
            </span>
            <h2 className="font-display text-headline-lg mb-8" style={{ color: '#1A2A3A' }}>
              Similar Books
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {similarBooks.slice(0, 5).map((book, idx) => (
                <div key={book.isbn} className="animate-stagger" style={{ animationDelay: `${idx * 50}ms` }}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
