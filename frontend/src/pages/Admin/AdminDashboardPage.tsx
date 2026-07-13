import { useEffect, useState } from 'react';
import { FiBookOpen, FiStar, FiUsers } from 'react-icons/fi';
import { getBooks } from '../../services/bookService';
import type { Book } from '../../types/book';

export default function AdminDashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBooks(1, 8)
      .then((res) => setBooks(res.books))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const avgRating = books.length
    ? (books.reduce((a, b) => a + b.rating, 0) / books.length).toFixed(1)
    : '—';

  const cards = [
    { label: 'Catalog entries', value: loading ? '…' : books.length || '—', icon: FiBookOpen },
    { label: 'Avg rating', value: loading ? '…' : avgRating, icon: FiStar },
    { label: 'Active readers', value: loading ? '…' : '2,480', icon: FiUsers },
  ];

  return (
    <div className="space-y-7">
      <section
        className="rounded-xl p-7"
        style={{
          background: 'linear-gradient(135deg, #1A2A3A 0%, #2C4055 100%)',
          color: '#FFFFFF',
        }}
      >
        <h1 className="font-display text-headline-lg" style={{ color: '#D4A853' }}>
          Admin Command Center
        </h1>
        <p className="mt-2 text-body-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Track platform growth, content quality, and reader engagement in one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="rounded-xl p-5"
            style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}
          >
            <Icon size={18} style={{ color: '#D4A853' }} />
            <p className="mt-3 text-body-sm" style={{ color: '#8A7E75' }}>{label}</p>
            <p className="mt-1 font-display text-headline-md" style={{ color: '#1A2A3A' }}>{value}</p>
          </article>
        ))}
      </section>

      <section>
        <h2 className="font-display text-headline-sm mb-4" style={{ color: '#1A2A3A' }}>
          Recent Catalog Highlights
        </h2>
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {books.map((book) => (
              <article
                key={book.isbn}
                className="rounded-xl p-4"
                style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}
              >
                <p className="font-display text-book-title" style={{ color: '#1A2A3A' }}>{book.title}</p>
                <p className="text-body-sm mt-1" style={{ color: '#8A7E75' }}>{book.author}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
