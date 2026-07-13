import { FiRefreshCw } from 'react-icons/fi';
import type { Book } from '../types/book';
import BookCard from './BookCard';

export default function BookCarousel({ title, books, loading = false }: { title: string; books: Book[]; loading?: boolean }) {
  if (loading) {
    return (
      <section className="py-16 shimmer-load" data-reveal-section>
        <div className="section-container">
          <div className="mb-8">
            <div className="h-6 w-48 skeleton rounded-sm mb-2" />
            <div className="h-5 w-32 skeleton rounded-sm" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!books || books.length === 0) return null;

  return (
    <section className="py-16 animate-fade-up" data-reveal-section style={{ animationDelay: '100ms' }}>
      <div className="section-container">
        <div className="flex justify-between items-end gap-4 mb-8">
          <div>
            <span className="text-label-md block mb-2 animate-fade-in" style={{ color: '#D4A853' }}>
              {title}
            </span>
            <h2 className="font-display text-headline-md animate-fade-in" style={{ color: '#1A2A3A', animationDelay: '50ms' }}>
              {title === 'RECOMMENDED FOR YOU' ? 'Recommended For You' : title}
            </h2>
          </div>
          <button
            className="flex items-center gap-2 text-body-sm transition-all focus-ring rounded-full px-4 py-2"
            style={{ color: '#8A7E75', backgroundColor: '#FAF6EF' }}
            aria-label="Refresh recommendations"
          >
            <FiRefreshCw size={15} className="transition-transform duration-300 hover:rotate-180" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.slice(0, 10).map((book, idx) => (
            <div key={book.isbn} className="animate-stagger" style={{ animationDelay: `${idx * 50}ms` }}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
