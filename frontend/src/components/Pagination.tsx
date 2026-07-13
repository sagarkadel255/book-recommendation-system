import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const maxVisible = 7;
  const half = Math.floor(maxVisible / 2);

  const pages: (number | '...')[] = [];
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= half + 1) {
    for (let i = 1; i <= maxVisible - 2; i++) pages.push(i);
    pages.push('...', totalPages);
  } else if (currentPage >= totalPages - half) {
    pages.push(1, '...');
    for (let i = totalPages - maxVisible + 3; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  }

  return (
    <nav className="flex justify-center items-center gap-1.5 mt-16" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: '#E8E2D8', color: '#8A7E75' }}
        aria-label="Previous page"
      >
        <FiChevronLeft size={18} />
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`e-${idx}`} className="px-2 select-none" style={{ color: '#B0A79F' }} aria-hidden>
            &hellip;
          </span>
        ) : (
          <button
            key={`p-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200 font-medium ${
              currentPage === page
                ? 'text-white'
                : 'bg-white hover:bg-surface-warm'
            }`}
            style={{
              backgroundColor: currentPage === page ? '#1A2A3A' : undefined,
              borderColor: currentPage === page ? '#1A2A3A' : '#E8E2D8',
              color: currentPage === page ? '#FFFFFF' : '#1A2A3A',
            }}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: '#E8E2D8', color: '#8A7E75' }}
        aria-label="Next page"
      >
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
}

