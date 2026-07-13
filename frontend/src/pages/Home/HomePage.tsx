import { useState, useEffect, useRef } from 'react';
import HeroSection from '../../components/HeroSection';
import GenreCarousel from '../../components/GenreCarousel';
import HowItWorks from '../../components/HowItWorks';
import TrendingCommunity from '../../components/TrendingCommunity';
import BookCarousel from '../../components/BookCarousel';
import { getPopularBooks, getTrendingBooks, getRecommendedBooks } from '../../services/bookService';
import type { Book } from '../../types/book';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiAlertCircle } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [popRes, trendRes, recRes] = await Promise.all([
          getPopularBooks(8),
          getTrendingBooks(8),
          getRecommendedBooks(12),
        ]);
        setPopularBooks(popRes);
        setTrendingBooks(trendRes);
        setRecommendedBooks(recRes);
      } catch (error) {
        setError('Unable to load recommendations right now. Please try again later.');
        console.error('Failed to load homepage data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const el = homeRef.current;
    if (!el) return;

    const sections = el.querySelectorAll('[data-reveal-section]');
    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        gsap.set(section, { y: 32, opacity: 0 });

        gsap.to(section, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={homeRef} className="flex flex-col w-full">
      <HeroSection />
      <GenreCarousel />
      {error && (
        <div className="section-container py-8">
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(201, 74, 74, 0.08)', border: '1px solid rgba(201, 74, 74, 0.2)' }}
          >
            <FiAlertCircle size={20} style={{ color: '#C94A4A', flexShrink: 0 }} />
            <p className="text-body-sm" style={{ color: '#5A5048' }}>{error}</p>
          </div>
        </div>
      )}
      <BookCarousel title="RECOMMENDED FOR YOU" books={recommendedBooks} loading={loading} />
      <TrendingCommunity books={trendingBooks.length > 0 ? trendingBooks : popularBooks} loading={loading} />
      <HowItWorks />
    </div>
  );
}
