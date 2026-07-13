import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF' }}>
      <div className="section-container py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="relative">
            <Link to="/" className="flex items-center gap-3 mb-5 focus-ring">
              <img
                src="/logo.png"
                alt="BookNest"
                className="h-9 w-auto"
              />
              <span className="font-display text-headline-md" style={{ color: '#FFFFFF' }}>
                BookNest
              </span>
            </Link>
            <p className="text-body-sm" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '320px' }}>
              AI-powered book discovery for readers who love finding their next great read.
              Thoughtfully curated, personally recommended.
            </p>
            <img
              src="/image.png"
              alt=""
              aria-hidden="true"
              className="mt-6 w-full max-w-[280px] rounded-lg opacity-80"
            />
          </div>

          <div>
            <h4 className="text-label-md mb-5" style={{ color: '#D4A853' }}>
              Discover
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Browse', to: '/explore' },
                { label: 'Recommendations', to: '/recommendations' },
                { label: 'Trending', to: '/explore?sort=rating' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-body-sm transition-colors duration-200 focus-ring"
                    style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A853')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label-md mb-5" style={{ color: '#D4A853' }}>
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-body-sm transition-colors duration-200 focus-ring"
                    style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A853')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label-md mb-5" style={{ color: '#D4A853' }}>
              Connect
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Contact', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-body-sm transition-colors duration-200 focus-ring"
                    style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A853')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-caption" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Made with <FiHeart size={12} style={{ color: '#C94A4A' }} /> by BookNest
          </div>
          <span className="text-caption" style={{ color: 'rgba(255,255,255,0.4)' }}>
            &copy; {new Date().getFullYear()} BookNest. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
