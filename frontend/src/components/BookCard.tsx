import { Link } from 'react-router-dom';
import { FiBookmark, FiCpu } from 'react-icons/fi';
import type { Book } from '../types/book';
import StarRating from './StarRating';
import { useLibrary } from '../context/LibraryContext';

interface BookCardProps {
  book: Book;
  showAIBadge?: boolean;
}

const FALLBACK_COVER = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <rect width="300" height="450" fill="#1A2A3A"/>
    <rect x="20" y="20" width="260" height="410" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="150" y="210" text-anchor="middle" font-family="Playfair Display, serif" font-weight="700" font-size="16" fill="#D4A853">NO COVER</text>
  </svg>`
)}`;

export default function BookCard({ book, showAIBadge }: BookCardProps) {
  const { isBookSaved, toggleBook } = useLibrary();
  const saved = isBookSaved(book.isbn);

  const hasValidImage = book.imageUrl && book.imageUrl.length > 10 && !book.imageUrl.includes('1x1');
  const imageSrc = hasValidImage ? book.imageUrl : FALLBACK_COVER;

  return (
    <article className="flex flex-col h-full bg-white rounded-xl overflow-hidden transition-all duration-300 group card-hover" style={{ border: '1px solid #E8E2D8' }}>
      <div className="relative aspect-[2/3] overflow-hidden" style={{ backgroundColor: '#1A2A3A' }}>
        <Link to={`/book/${book.isbn}`} className="block h-full w-full">
          <img
            src={imageSrc}
            alt={`${book.title} by ${book.author}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_COVER; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {showAIBadge && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-label-sm font-medium bg-white/90 backdrop-blur-sm"
            style={{ color: '#1A2A3A' }}
            title="AI recommended"
          >
            <FiCpu size={12} />
            <span>AI</span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleBook(book);
          }}
          className={`absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
            saved
              ? 'bg-accent text-primary-dark'
              : 'bg-white/80 backdrop-blur-sm text-text-secondary hover:bg-white'
          }`}
          aria-label={saved ? "Remove from library" : "Add to library"}
        >
          <FiBookmark size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/book/${book.isbn}`} className="block flex-grow mb-2" style={{ textDecoration: 'none' }}>
          <h3 className="font-display text-book-title mb-1 transition-colors duration-200 line-clamp-2" style={{ color: '#1A2A3A' }}>
            {book.title}
          </h3>
          <p className="text-body-sm truncate" style={{ color: '#8A7E75' }}>
            {book.author}
          </p>
        </Link>

        <StarRating rating={book.rating} count={book.ratingCount} />
      </div>
    </article>
  );
}
