import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const bookCovers = [
  'book1.png', 'book2.png', 'book3.png', 'book4.png', 'book5.png',
  'book6.png', 'book7.png', 'book8.png', 'book9.png', 'book10.png',
];

const bookPositions = [
  { x: -42, y: -38, z: 120, rotX: -8, rotY: 15, rotZ: -6, scale: 0.95 },
  { x: -20, y: -5, z: 50, rotX: 4, rotY: -12, rotZ: 3, scale: 1.0 },
  { x: -15, y: 20, z: 90, rotX: -5, rotY: 8, rotZ: -4, scale: 0.9 },
  { x: 5, y: -30, z: 160, rotX: 6, rotY: -18, rotZ: 5, scale: 1.05 },
  { x: 20, y: 10, z: 70, rotX: -3, rotY: 14, rotZ: -2, scale: 0.88 },
  { x: 35, y: -20, z: 130, rotX: 7, rotY: -10, rotZ: 4, scale: 1.0 },
  { x: -35, y: 30, z: 100, rotX: -6, rotY: 20, rotZ: -5, scale: 0.92 },
  { x: 42, y: 25, z: 60, rotX: 3, rotY: -15, rotZ: 2, scale: 0.95 },
  { x: 15, y: 35, z: 140, rotX: -4, rotY: 12, rotZ: -3, scale: 1.02 },
  { x: -10, y: -40, z: 80, rotX: 5, rotY: -8, rotZ: 6, scale: 0.85 },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const booksContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = booksContainerRef.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>('.floating-book');

    items.forEach((item, i) => {
      const pos = bookPositions[i];
      gsap.set(item, {
        xPercent: pos.x,
        yPercent: pos.y,
        rotationX: pos.rotX,
        rotationY: pos.rotY,
        rotationZ: pos.rotZ,
        scale: 0,
        opacity: 0,
        transformPerspective: 1200,
        transformOrigin: 'center center',
        force3D: true,
      });
    });

    gsap.to(items, {
      scale: (i: number) => bookPositions[i].scale,
      opacity: 1,
      duration: 1.4,
      stagger: 0.1,
      ease: 'elastic.out(1, 0.75)',
      delay: 0.4,
      onComplete: () => setIsLoaded(true),
    });

    const ctx = gsap.context(() => {
      items.forEach((item, i) => {
        const pos = bookPositions[i];
        
        gsap.to(item, {
          yPercent: pos.y + (i % 2 === 0 ? 6 : -6),
          rotationX: pos.rotX + (i % 3 === 0 ? 3 : -3),
          rotationZ: pos.rotZ + (i % 2 === 0 ? 2 : -2),
          duration: 4 + (i * 0.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          items.forEach((item, i) => {
            const direction = i % 2 === 0 ? 1 : -1;
            gsap.set(item, {
              y: progress * 120 * direction,
              rotationY: bookPositions[i].rotY + progress * 15 * direction,
            });
          });
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    const searchQuery = input?.value || '';
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#0F1A24' }}
    >
      {}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 168, 83, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 168, 83, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: '900px',
            height: '900px',
            background: 'radial-gradient(circle, rgba(212, 168, 83, 0.08) 0%, transparent 60%)',
            top: '-25%',
            right: '-15%',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(26, 60, 100, 0.15) 0%, transparent 60%)',
            bottom: '-10%',
            left: '-5%',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(212, 168, 83, 0.06) 0%, transparent 60%)',
            top: '40%',
            left: '40%',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {}
      <div
        ref={booksContainerRef}
        className="absolute top-0 bottom-0 right-0 w-full lg:w-[55%] pointer-events-none opacity-30 lg:opacity-100"
        style={{
          perspective: '1400px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {bookCovers.map((src, index) => {
            const pos = bookPositions[index];
            
            const left = `${50 + pos.x * 0.8}%`;
            const top = `${50 + pos.y * 0.8}%`;

            return (
              <div
                key={src}
                className="floating-book absolute pointer-events-auto cursor-pointer"
                style={{
                  width: 'clamp(140px, 14vw, 200px)',
                  height: 'clamp(200px, 20vw, 290px)',
                  left,
                  top,
                  transform: 'translate(-50%, -50%)',
                  transformStyle: 'preserve-3d',
                  zIndex: Math.round(pos.z),
                }}
              >
                <div
                  className="w-full h-full rounded-xl overflow-hidden transition-all duration-500 ease-out group"
                  style={{
                    boxShadow: `
                      0 20px 60px rgba(0,0,0,0.6),
                      0 4px 12px rgba(0,0,0,0.4),
                      inset 0 1px 0 rgba(255,255,255,0.1)
                    `,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'scale(1.12) rotateY(-5deg) translateZ(40px)';
                    el.style.boxShadow = `
                      0 35px 80px rgba(212, 168, 83, 0.35),
                      0 8px 20px rgba(0,0,0,0.5),
                      inset 0 1px 0 rgba(255,255,255,0.2)
                    `;
                    el.style.borderColor = 'rgba(212, 168, 83, 0.3)';
                    el.style.zIndex = '100';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = '';
                    el.style.boxShadow = `
                      0 20px 60px rgba(0,0,0,0.6),
                      0 4px 12px rgba(0,0,0,0.4),
                      inset 0 1px 0 rgba(255,255,255,0.1)
                    `;
                    el.style.borderColor = 'rgba(255,255,255,0.08)';
                    el.style.zIndex = '';
                  }}
                >
                  <img
                    src={`/${src}`}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                  {}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {}
      <div className="section-container relative z-20 pt-16 pb-24 w-full">
        <div className="max-w-2xl animate-fade-up">
          <h1
            className="font-display text-headline-display mb-6 leading-tight tracking-tight animate-fade-up"
            style={{
              color: '#FFFFFF',
              animationDelay: '100ms',
              textShadow: '0 4px 30px rgba(0,0,0,0.5)',
            }}
          >
            Find Your Next
            <br />
            <span style={{ color: '#D4A853' }}>Great Read</span>
          </h1>

          <p
            className="text-body-lg mb-10 animate-fade-in"
            style={{
              color: 'rgba(255,255,255,0.65)',
              animationDelay: '150ms',
              maxWidth: '480px',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            AI-powered book discovery for readers who love finding something extraordinary.
          </p>

          <form
            onSubmit={handleSearch}
            className="max-w-lg mb-8 animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            <div
              className="flex items-center gap-2 p-1.5 rounded-full transition-all focus-within:ring-2 focus-within:ring-accent/40"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
              }}
            >
              <div className="flex-1 flex items-center gap-3 pl-5">
                <FiSearch className="shrink-0" size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="text"
                  placeholder="Type a book you loved..."
                  className="w-full py-3 text-base outline-none bg-transparent font-body placeholder:text-white/30"
                  style={{ color: '#FFFFFF' }}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full font-medium text-sm transition-all flex items-center gap-2 focus-ring hover:brightness-110"
                style={{ backgroundColor: '#D4A853', color: '#0F1A24' }}
              >
                Search
                <FiArrowRight size={18} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-label-md font-medium transition-all focus-ring hover:bg-white/10"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                textDecoration: 'none',
              }}
            >
              Browse Genres
            </Link>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-label-md font-medium transition-all focus-ring hover:brightness-110"
              style={{
                backgroundColor: 'rgba(212, 168, 83, 0.15)',
                color: '#D4A853',
                textDecoration: 'none',
                border: '1px solid rgba(212, 168, 83, 0.2)',
              }}
            >
              AI Recommendations
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg
          className="relative block w-full h-[60px] md:h-[120px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="#FDF8F0"
          ></path>
        </svg>
      </div>

      {}
      {isLoaded && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                backgroundColor: i % 3 === 0 ? 'rgba(212, 168, 83, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatParticle ${6 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
