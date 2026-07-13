import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4 animate-fade-in">
        <span className="text-label-md block mb-6" style={{ color: '#D4A853' }}>
          ERROR 404
        </span>
        <h1
          className="font-display text-headline-display mb-6"
          style={{ color: '#1A2A3A' }}
        >
          Page Not Found
        </h1>
        <p className="text-body-lg max-w-md mx-auto mb-10" style={{ color: '#8A7E75' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-label-md font-medium transition-all"
          style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF', textDecoration: 'none' }}
        >
          <FiArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
