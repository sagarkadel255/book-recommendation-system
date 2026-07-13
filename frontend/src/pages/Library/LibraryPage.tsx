import { useLibrary } from '../../context/LibraryContext';
import BookCard from '../../components/BookCard';
import { Link } from 'react-router-dom';
import { FiBookmark } from 'react-icons/fi';

export default function LibraryPage() {
  const { savedBooks } = useLibrary();

  return (
    <div className="w-full pb-16">
      <div className="section-container pt-20">
        <div className="mb-10">
          <span className="text-label-md mb-3 block" style={{ color: '#D4A853' }}>
            YOUR COLLECTION
          </span>
          <h1 className="font-display text-headline-lg mb-3" style={{ color: '#1A2A3A' }}>
            Saved Books
          </h1>
          <p className="text-body-md" style={{ color: '#8A7E75' }}>
            {savedBooks.length > 0
              ? `You have ${savedBooks.length} book${savedBooks.length !== 1 ? 's' : ''} in your library`
              : 'Start building your personal reading collection'}
          </p>
        </div>

        {savedBooks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-xl animate-fade-in"
            style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: '#E8E2D8' }}
            >
              <FiBookmark className="text-text-secondary" size={28} />
            </div>
            <h3 className="font-display text-headline-sm mb-3" style={{ color: '#2C2420' }}>
              Your library is waiting
            </h3>
            <p className="text-body-md max-w-md mb-6" style={{ color: '#8A7E75' }}>
              You haven't saved any books yet. Explore our collections to start building your personal library.
            </p>
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded-full font-medium text-label-md transition-all"
              style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF', textDecoration: 'none' }}
            >
              Explore Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {savedBooks.map((book, idx) => (
              <div key={book.isbn} className="animate-stagger" style={{ animationDelay: `${idx * 50}ms` }}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
