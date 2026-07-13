import { Link } from 'react-router-dom';

const genres = [
  { name: 'All Genres', path: '/explore' },
  { name: 'Fiction', path: '/explore?category=Fiction' },
  { name: 'Biographies', path: '/explore?category=Biographies' },
  { name: 'History', path: '/explore?category=History' },
  { name: 'Classics', path: '/explore?category=Classics' },
];

export default function GenreCarousel() {
  return (
    <section className="py-20 animate-fade-up" data-reveal-section style={{ animationDelay: '50ms' }}>
      <div className="section-container">
        <div className="text-center mb-12">
          <span className="text-label-md mb-4 block" style={{ color: '#D4A853' }}>
            BROWSE BY GENRE
          </span>
          <h2 className="font-display text-headline-lg mb-4" style={{ color: '#1A2A3A' }}>
            Explore Books by Genre
          </h2>
          <p className="text-body-md max-w-xl mx-auto" style={{ color: '#8A7E75' }}>
            Discover your next great read across dozens of categories and genres,
            thoughtfully curated for every mood.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {genres.map((genre) => (
            <Link
              key={genre.name}
              to={genre.path}
              className="px-6 py-3 rounded-full text-label-md font-medium transition-all duration-200 animate-stagger"
              style={{
                color: '#1A2A3A',
                border: '1px solid #E8E2D8',
                backgroundColor: '#FFFFFF',
                textDecoration: 'none',
              }}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
