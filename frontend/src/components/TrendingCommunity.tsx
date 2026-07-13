import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import type { Book } from '../types/book';

const FALLBACK_COVER = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
    <rect width="200" height="300" fill="#1A2A3A"/>
    <rect x="15" y="15" width="170" height="270" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="100" y="150" text-anchor="middle" font-family="Playfair Display, serif" font-weight="700" font-size="14" fill="#D4A853">NO COVER</text>
  </svg>`
)}`;

function StarRow({ rating }: { rating: number }) {
  const fullStars = Math.floor((rating / 10) * 5);
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={11}
          fill={star <= fullStars ? '#D4A853' : 'none'}
          stroke={star <= fullStars ? '#D4A853' : '#E8E2D8'}
        />
      ))}
    </div>
  );
}

export default function TrendingCommunity({ books, loading }: { books: Book[]; loading?: boolean }) {
  if (loading) {
    return (
      <section className="py-16 shimmer-load" data-reveal-section style={{ animationDelay: '150ms' }}>
        <div className="section-container">
          <div className="mb-10">
            <div className="h-4 w-24 skeleton rounded-sm mb-3" />
            <div className="h-8 w-48 skeleton rounded-sm" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white border" style={{ borderColor: '#E8E2D8' }}>
                <div className="aspect-[2/3] skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 skeleton rounded-sm" />
                  <div className="h-3 w-1/2 skeleton rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!books || books.length === 0) return null;

  return (
    <section className="py-16 animate-fade-up" data-reveal-section style={{ animationDelay: '200ms' }}>
      <div className="section-container">
        <div className="mb-10">
          <span className="text-label-md mb-3 block" style={{ color: '#D4A853' }}>
            TRENDING NOW
          </span>
          <h2 className="font-display text-headline-lg" style={{ color: '#1A2A3A' }}>
            What's Popular
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.slice(0, 8).map((book, idx) => (
            <Link
              key={book.isbn}
              to={`/book/${book.isbn}`}
              className="group block animate-stagger"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div
                className="rounded-xl overflow-hidden bg-white transition-all duration-300 group-hover:-translate-y-1 card-hover"
                style={{ border: '1px solid #E8E2D8' }}
              >
                <div className="aspect-[2/3] overflow-hidden relative" style={{ backgroundColor: '#1A2A3A' }}>
                  <img
                    src={book.imageUrl && book.imageUrl.length > 10 ? book.imageUrl : FALLBACK_COVER}
                    alt={`${book.title} by ${book.author}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_COVER; }}
                  />
                  {book.rating > 0 && (
                    <div
                      className="absolute bottom-2 right-2 px-2 py-1 rounded-full flex items-center gap-1"
                      style={{ backgroundColor: 'rgba(26, 42, 58, 0.8)', color: '#FFFFFF' }}
                    >
                      <FiStar size={10} fill="#D4A853" stroke="#D4A853" />
                      <span className="text-xs font-medium">{book.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <span className="text-label-sm block mb-1" style={{ color: '#B0A79F' }}>
                    #{idx + 1}
                  </span>
                  <h3
                    className="font-display text-book-title line-clamp-1 transition-colors duration-200"
                    style={{ color: '#1A2A3A' }}
                  >
                    {book.title}
                  </h3>
                  <p className="text-body-sm mt-1 line-clamp-1" style={{ color: '#8A7E75' }}>
                    {book.author}
                  </p>
                  <div className="mt-2">
                    <StarRow rating={book.rating} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
