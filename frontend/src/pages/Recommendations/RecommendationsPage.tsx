import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiCpu, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import BookCard from '../../components/BookCard';
import { getRecommendations } from '../../services/recommendService';
import type { Book } from '../../types/book';

export default function RecommendationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchStr: string) => {
    if (!searchStr.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await getRecommendations(searchStr);
      setResults(response.recommendations || []);
    } catch (err) {
      const fallbackMessage = err instanceof Error ? err.message : 'Failed to get recommendations';
      setError(fallbackMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    handleSearch(query);
  };

  const runExample = (title: string) => {
    setQuery(title);
    setSearchParams({ q: title });
    handleSearch(title);
  };

  return (
    <div className="w-full flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-4xl text-center flex flex-col items-center gap-6">
        <span
          className="inline-block px-4 py-2 rounded-full text-label-sm font-medium animate-fade-in"
          style={{ backgroundColor: '#1A2A3A', color: '#D4A853' }}
        >
          AI BOOK MATCHMAKER
        </span>

        <h1 className="font-display text-headline-lg animate-fade-in" style={{ color: '#1A2A3A', animationDelay: '100ms' }}>
          Find Books Like Your Favorites
        </h1>
        <p
          className="text-body-lg max-w-2xl mx-auto mb-8 animate-fade-in"
          style={{ color: '#8A7E75', animationDelay: '200ms' }}
        >
          Enter a book title you love, and our AI will find structurally similar recommendations
          tailored to your taste.
        </p>

        <form
          onSubmit={onSubmit}
          className="w-full max-w-xl relative mt-4 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <div
            className="flex items-center gap-2 rounded-full bg-white transition-all"
            style={{ border: '1px solid #E8E2D8' }}
          >
            <div className="pl-5 pr-2 py-2 flex items-center" style={{ color: '#8A7E75' }}>
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a book you loved..."
              className="flex-1 pr-4 py-3 text-base outline-none bg-transparent font-body"
              style={{ color: '#2C2420' }}
              required
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-full font-medium text-sm transition-all disabled:opacity-50 focus-ring"
              style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF' }}
            >
              {loading ? 'Analyzing...' : 'Match'}
              <FiArrowRight size={16} className="inline-block ml-1" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-2 mt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <span className="text-body-sm" style={{ color: '#8A7E75' }}>Try:</span>
          <button
            type="button"
            onClick={() => runExample('The Da Vinci Code')}
            className="transition-all focus-ring text-body-sm font-medium"
            style={{ color: '#D4A853' }}
          >
            The Da Vinci Code
          </button>
          <span style={{ color: '#E8E2D8' }}>/</span>
          <button
            type="button"
            onClick={() => runExample("Harry Potter and the Sorcerer's Stone")}
            className="transition-all focus-ring text-body-sm font-medium"
            style={{ color: '#D4A853' }}
          >
            Harry Potter
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl mt-16">
        {error && (
          <div
            className="max-w-3xl mx-auto p-6 rounded-xl flex gap-4 animate-fade-in"
            style={{ backgroundColor: 'rgba(201, 74, 74, 0.08)', border: '1px solid rgba(201, 74, 74, 0.2)' }}
          >
            <FiAlertCircle size={24} style={{ color: '#C94A4A', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 className="font-display font-bold mb-1" style={{ color: '#C94A4A' }}>Error</h3>
              <p className="text-body-sm" style={{ color: '#5A5048' }}>{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 opacity-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
            ))}
          </div>
        )}

        {!loading && hasSearched && !error && results.length > 0 && (
          <div className="animate-fade-in">
            <div
              className="flex gap-5 mb-10 p-6 rounded-xl"
              style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#1A2A3A' }}
              >
                <FiCpu size={22} style={{ color: '#D4A853' }} />
              </div>
              <div>
                <h2 className="font-display text-headline-md mb-2" style={{ color: '#1A2A3A' }}>
                  AI Analysis Complete
                </h2>
                <p className="text-body-md" style={{ color: '#8A7E75' }}>
                  Because you liked <span className="font-semibold" style={{ color: '#1A2A3A' }}>"{query}"</span>,
                  our model suggests these similar titles.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {results.map((book, idx) => (
                <div key={book.isbn} className="animate-stagger" style={{ animationDelay: `${idx * 50}ms` }}>
                  <BookCard book={book} showAIBadge />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && hasSearched && !error && results.length === 0 && (
          <div
            className="max-w-3xl mx-auto p-10 text-center rounded-xl"
            style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}
          >
            <h3 className="font-display text-headline-sm mb-2" style={{ color: '#2C2420' }}>
              No recommendations found
            </h3>
            <p className="text-body-md" style={{ color: '#8A7E75' }}>
              Try a different book title or browse our catalog.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
