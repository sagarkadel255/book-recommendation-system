import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiX, FiSliders, FiSearch, FiAlertCircle } from 'react-icons/fi';
import BookCard from '../../components/BookCard';
import Pagination from '../../components/Pagination';
import { getBooks, getGenres, searchAuthors } from '../../services/bookService';
import type { Book, Category } from '../../types/book';

const GENRE_ICONS: Record<string, string> = {
  Romance: '❤️',
  'Mystery & Thriller': '🔍',
  'Science Fiction': '🚀',
  Fantasy: '🐉',
  Horror: '👻',
  'Historical Fiction': '🏛️',
  "Children's": '🧸',
  Classics: '📜',
  Biography: '📖',
  'Religion & Spirituality': '🙏',
  Education: '📚',
  Technology: '💻',
  'Health & Wellness': '💪',
  Travel: '✈️',
  'Art & Entertainment': '🎨',
  'Cooking & Food': '🍳',
  'Sports & Recreation': '⚽',
  Business: '💼',
  'Self-Help': '🌟',
  'Comics & Graphic Novels': '💬',
  'Nature & Science': '🌿',
  Philosophy: '🤔',
  'General Fiction': '📖',
  Other: '📄',
};

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [authorSuggestions, setAuthorSuggestions] = useState<string[]>([]);
  const [showAuthorSuggestions, setShowAuthorSuggestions] = useState(false);
  const authorRef = useRef<HTMLDivElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const genre = searchParams.get('genre') || '';
  const author = searchParams.get('author') || '';
  const minYear = searchParams.get('minYear') || '';
  const maxYear = searchParams.get('maxYear') || '';

  const [authorInput, setAuthorInput] = useState(author);
  const [minYearInput, setMinYearInput] = useState(minYear);
  const [maxYearInput, setMaxYearInput] = useState(maxYear);
  const [sortInput, setSortInput] = useState(sort);

  const fetchGenres = useCallback(async () => {
    try {
      const data = await getGenres();
      setGenres(data);
    } catch {
      setGenres([]);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters: { genre?: string; author?: string; minYear?: string; maxYear?: string } = {};
        if (genre) filters.genre = genre;
        if (author) filters.author = author;
        if (minYear) filters.minYear = minYear;
        if (maxYear) filters.maxYear = maxYear;
        const res = await getBooks(page, 20, search || undefined, sort || undefined, filters);
        setBooks(res.books);
        setTotalBooks(res.total);
        setTotalPages(res.totalPages);
      } catch (e) {
        setError('Failed to load books. Please check your connection and try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [page, search, sort, genre, author, minYear, maxYear]);

  useEffect(() => {
    setAuthorInput(author);
    setMinYearInput(minYear);
    setMaxYearInput(maxYear);
    setSortInput(sort);
  }, [author, minYear, maxYear, sort]);

  useEffect(() => {
    if (authorInput.length < 2) {
      setAuthorSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchAuthors(authorInput);
        setAuthorSuggestions(results);
      } catch {
        setAuthorSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [authorInput]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (authorRef.current && !authorRef.current.contains(e.target as Node)) {
        setShowAuthorSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const updateParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setAuthorInput('');
    setMinYearInput('');
    setMaxYearInput('');
    setSortInput('');
  };

  const handleGenreClick = (name: string) => {
    updateParam('genre', genre === name ? '' : name);
  };

  const handleAuthorSelect = (name: string) => {
    setAuthorInput(name);
    setShowAuthorSuggestions(false);
    updateParam('author', name);
  };

  const applyYearFilter = () => {
    if (minYearInput) updateParam('minYear', minYearInput);
    else setSearchParams((prev) => { prev.delete('minYear'); return prev; });
    if (maxYearInput) updateParam('maxYear', maxYearInput);
    else setSearchParams((prev) => { prev.delete('maxYear'); return prev; });
  };

  const applySort = (value: string) => {
    setSortInput(value);
    updateParam('sort', value);
  };

  const hasActiveFilters = genre || author || minYear || maxYear || sort;
  const activeFilterCount = [genre, author, minYear || maxYear, sort].filter(Boolean).length;

  return (
    <div className="w-full">
      <div className="section-container py-16">
        <div className="mb-10">
          <span className="text-label-md mb-3 block" style={{ color: '#D4A853' }}>
            {search ? 'SEARCH RESULTS' : 'BROWSE'}
          </span>
          <h1 className="font-display text-headline-lg mb-3" style={{ color: '#1A2A3A' }}>
            {search ? `Results for "${search}"` : 'Explore Books'}
          </h1>
          <p className="text-body-md" style={{ color: '#8A7E75' }}>
            Discover thousands of titles. Filter by genre, author, or year.
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-body-sm" style={{ color: '#8A7E75' }}>
              Showing <span style={{ color: '#1A2A3A', fontWeight: 500 }}>{books.length}</span> of{' '}
              <span style={{ color: '#1A2A3A', fontWeight: 500 }}>{totalBooks.toLocaleString()}</span> results
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-label-sm transition-colors"
                style={{ color: '#D4A853' }}
              >
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-label-sm font-medium transition-all"
            style={{
              backgroundColor: showFilters ? '#1A2A3A' : '#FFFFFF',
              color: showFilters ? '#FFFFFF' : '#1A2A3A',
              border: '1px solid #E8E2D8',
            }}
          >
            {showFilters ? <FiX size={16} /> : <FiSliders size={16} />}
            {showFilters ? 'Close Filters' : `Filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}`}
          </button>
        </div>

        {}
        {hasActiveFilters && !showFilters && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-label-sm" style={{ color: '#8A7E75' }}>Active:</span>
            {genre && (
              <Chip
                label={`${GENRE_ICONS[genre] || '📖'} ${genre}`}
                onRemove={() => updateParam('genre', '')}
              />
            )}
            {author && (
              <Chip label={`✍️ ${author}`} onRemove={() => { setAuthorInput(''); updateParam('author', ''); }} />
            )}
            {minYear && (
              <Chip label={`📅 From ${minYear}`} onRemove={() => setSearchParams((prev) => { prev.delete('minYear'); return prev; })} />
            )}
            {maxYear && (
              <Chip label={`📅 Until ${maxYear}`} onRemove={() => setSearchParams((prev) => { prev.delete('maxYear'); return prev; })} />
            )}
            {sort && (
              <Chip label={`Sort: ${sort}`} onRemove={() => applySort('')} />
            )}
          </div>
        )}

        {showFilters && (
          <div
            className="mb-8 bg-white rounded-xl animate-slide-down overflow-hidden"
            style={{ border: '1px solid #E8E2D8' }}
          >
            {}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-label-md" style={{ color: '#1A2A3A' }}>
                  Genre
                </span>
                {genre && (
                  <button
                    onClick={() => updateParam('genre', '')}
                    className="text-label-sm transition-colors"
                    style={{ color: '#D4A853' }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {genres.map((g) => {
                  const isActive = genre === g.name;
                  return (
                    <button
                      key={g.name}
                      onClick={() => handleGenreClick(g.name)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-label-sm transition-all duration-200 ${
                        isActive ? 'text-white' : 'text-text-secondary hover:bg-surface-warm'
                      }`}
                      style={{
                        backgroundColor: isActive ? '#1A2A3A' : '#FFFFFF',
                        border: isActive ? 'none' : '1px solid #E8E2D8',
                      }}
                    >
                      <span>{GENRE_ICONS[g.name] || '📖'}</span>
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E8E2D8' }} />

            {}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-label-md" style={{ color: '#1A2A3A' }}>
                  Author
                </span>
                {author && (
                  <button
                    onClick={() => { setAuthorInput(''); updateParam('author', ''); }}
                    className="text-label-sm transition-colors"
                    style={{ color: '#D4A853' }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative" ref={authorRef}>
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all"
                  style={{ border: '1px solid #E8E2D8', backgroundColor: '#FAF6EF' }}
                >
                  <FiSearch size={16} style={{ color: '#8A7E75' }} />
                  <input
                    ref={authorInputRef}
                    type="text"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onFocus={() => authorSuggestions.length > 0 && setShowAuthorSuggestions(true)}
                    placeholder="Search by author name..."
                    className="w-full outline-none bg-transparent text-body-sm"
                    style={{ color: '#2C2420' }}
                  />
                </div>
                {showAuthorSuggestions && authorSuggestions.length > 0 && (
                  <div
                    className="absolute z-10 left-0 right-0 mt-1 rounded-xl bg-white max-h-48 overflow-y-auto animate-slide-down"
                    style={{ border: '1px solid #E8E2D8', boxShadow: '0 8px 24px rgba(26, 42, 58, 0.1)' }}
                  >
                    {authorSuggestions.map((name) => (
                      <button
                        key={name}
                        onClick={() => handleAuthorSelect(name)}
                        className="w-full text-left px-4 py-2.5 text-body-sm transition-colors hover:bg-surface-warm bg-transparent border-none cursor-pointer"
                        style={{ color: '#2C2420' }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E8E2D8' }} />

            {}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-label-md" style={{ color: '#1A2A3A' }}>
                  Publication Year
                </span>
                {(minYear || maxYear) && (
                  <button
                    onClick={() => { setMinYearInput(''); setMaxYearInput(''); setSearchParams((prev) => { prev.delete('minYear'); prev.delete('maxYear'); return prev; }); }}
                    className="text-label-sm transition-colors"
                    style={{ color: '#D4A853' }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={minYearInput}
                  onChange={(e) => setMinYearInput(e.target.value)}
                  placeholder="From"
                  className="w-full px-4 py-2.5 rounded-lg outline-none text-body-sm transition-all"
                  style={{ border: '1px solid #E8E2D8', backgroundColor: '#FAF6EF', color: '#2C2420' }}
                  min="1900"
                  max={new Date().getFullYear().toString()}
                />
                <span className="text-body-sm" style={{ color: '#B0A79F' }}>to</span>
                <input
                  type="number"
                  value={maxYearInput}
                  onChange={(e) => setMaxYearInput(e.target.value)}
                  placeholder="To"
                  className="w-full px-4 py-2.5 rounded-lg outline-none text-body-sm transition-all"
                  style={{ border: '1px solid #E8E2D8', backgroundColor: '#FAF6EF', color: '#2C2420' }}
                  min="1900"
                  max={new Date().getFullYear().toString()}
                />
                <button
                  onClick={applyYearFilter}
                  className="px-5 py-2.5 rounded-full text-label-sm font-medium transition-all"
                  style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF' }}
                >
                  Apply
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E8E2D8' }} />

            {}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-label-md" style={{ color: '#1A2A3A' }}>
                  Sort By
                </span>
                {sort && (
                  <button
                    onClick={() => applySort('')}
                    className="text-label-sm transition-colors"
                    style={{ color: '#D4A853' }}
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '', label: 'Popularity' },
                  { value: 'rating', label: 'Rating' },
                  { value: 'title', label: 'Title' },
                  { value: 'year', label: 'Year' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => applySort(opt.value)}
                    className={`px-4 py-2 rounded-full text-label-sm transition-all duration-200 ${
                      sortInput === opt.value ? 'text-white' : 'text-text-secondary hover:bg-surface-warm'
                    }`}
                    style={{
                      backgroundColor: sortInput === opt.value ? '#1A2A3A' : '#FFFFFF',
                      border: sortInput === opt.value ? 'none' : '1px solid #E8E2D8',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="min-h-[500px]">
          {error && (
            <div
              className="flex items-center gap-3 p-5 mb-8 rounded-xl animate-fade-in"
              style={{ backgroundColor: 'rgba(201, 74, 74, 0.08)', border: '1px solid rgba(201, 74, 74, 0.2)' }}
            >
              <FiAlertCircle size={20} style={{ color: '#C94A4A', flexShrink: 0 }} />
              <p className="text-body-sm" style={{ color: '#5A5048' }}>{error}</p>
            </div>
          )}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
              ))}
            </div>
          ) : !error && books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.map((book, idx) => (
                <div key={book.isbn} className="animate-stagger" style={{ animationDelay: `${idx * 50}ms` }}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : !error && (
            <div
              className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-xl animate-fade-in"
              style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: '#E8E2D8' }}
              >
                <FiSliders size={24} style={{ color: '#8A7E75' }} />
              </div>
              <h3 className="font-display text-headline-sm mb-3" style={{ color: '#2C2420' }}>
                No books match your filters
              </h3>
              <p className="text-body-sm mb-6 max-w-md" style={{ color: '#8A7E75' }}>
                Try adjusting your genre, author, or year selection to discover more titles.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-full font-medium text-label-md transition-all"
                style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {!loading && books.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => {
            setSearchParams((prev) => { prev.set('page', p.toString()); return prev; });
          }} />
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm"
      style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF' }}
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-white/20 rounded-full p-0.5 transition-colors bg-transparent border-none cursor-pointer"
        aria-label={`Remove ${label} filter`}
      >
        <FiX size={14} />
      </button>
    </span>
  );
}
