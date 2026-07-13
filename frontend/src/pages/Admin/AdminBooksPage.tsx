import { useEffect, useState } from 'react';
import { getBooks } from '../../services/bookService';
import type { Book } from '../../types/book';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBooks(1, 30)
      .then((res) => setBooks(res.books))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-headline-lg" style={{ color: '#1A2A3A' }}>Books Management</h1>
      <p className="mt-2 text-body-sm" style={{ color: '#8A7E75' }}>
        Review title quality and metadata consistency across the catalog.
      </p>
      {loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 rounded-xl skeleton" />
          ))}
        </div>
      ) : (
        <div
          className="mt-6 overflow-x-auto rounded-xl"
          style={{ border: '1px solid #E8E2D8' }}
        >
          <table className="w-full min-w-[780px] text-left text-body-sm">
            <thead style={{ backgroundColor: '#FAF6EF' }}>
              <tr>
                <th className="px-4 py-3 font-semibold" style={{ color: '#1A2A3A' }}>Title</th>
                <th className="px-4 py-3 font-semibold" style={{ color: '#1A2A3A' }}>Author</th>
                <th className="px-4 py-3 font-semibold" style={{ color: '#1A2A3A' }}>Publisher</th>
                <th className="px-4 py-3 font-semibold" style={{ color: '#1A2A3A' }}>Year</th>
                <th className="px-4 py-3 font-semibold" style={{ color: '#1A2A3A' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.isbn}
                  style={{ borderTop: '1px solid #E8E2D8' }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: '#1A2A3A' }}>{book.title}</td>
                  <td className="px-4 py-3" style={{ color: '#5A5048' }}>{book.author}</td>
                  <td className="px-4 py-3" style={{ color: '#5A5048' }}>{book.publisher || '—'}</td>
                  <td className="px-4 py-3" style={{ color: '#5A5048' }}>{book.year}</td>
                  <td className="px-4 py-3" style={{ color: '#D4A853' }}>{book.rating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
