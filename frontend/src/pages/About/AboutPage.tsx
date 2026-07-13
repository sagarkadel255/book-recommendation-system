import { FiBookOpen, FiCpu, FiHeart, FiStar, FiUsers, FiGlobe } from 'react-icons/fi';

const values = [
  {
    icon: FiHeart,
    title: 'Made for Readers',
    description: 'Every feature is crafted with the reader\'s journey in mind — from discovery to the final page.',
  },
  {
    icon: FiCpu,
    title: 'AI-Powered Discovery',
    description: 'Our hybrid recommendation engine combines collaborative filtering with natural language matching to find books you\'ll love.',
  },
  {
    icon: FiStar,
    title: 'Quality First',
    description: 'We surface the highest-rated books from a curated catalog of over 270,000 titles spanning every genre.',
  },
  {
    icon: FiUsers,
    title: 'Community Driven',
    description: 'Real ratings from real readers. Our recommendations are grounded in how actual readers engage with books.',
  },
  {
    icon: FiGlobe,
    title: 'Always Growing',
    description: 'Our catalog expands continuously. New titles, fresh recommendations, and evolving taste profiles.',
  },
  {
    icon: FiBookOpen,
    title: 'Your Personal Library',
    description: 'Save books, track your reading, and build a personal collection that grows with you.',
  },
];

const stats = [
  { label: 'Books in Catalog', value: '270K+' },
  { label: 'Active Readers', value: '2,480+' },
  { label: 'Ratings Processed', value: '1M+' },
  { label: 'AI Recommendations', value: '50K+' },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FDF8F0]">
      {}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#1A2A3A' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/aboutus.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
        {}
        <div className="absolute inset-0 opacity-60" style={{
          background: 'linear-gradient(45deg, #1A2A3A 0%, rgba(212,168,83,0.3) 100%)',
        }} />
        
        <div className="section-container relative z-10 py-24 flex justify-center">
          <div className="max-w-3xl text-center p-10 md:p-14 rounded-3xl" style={{
            background: 'rgba(26, 42, 58, 0.4)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)'
          }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-label-md mb-6 tracking-widest animate-fade-in" style={{ backgroundColor: 'rgba(212, 168, 83, 0.15)', color: '#D4A853', border: '1px solid rgba(212, 168, 83, 0.3)' }}>
              ABOUT BOOKNEST
            </span>
            <h1 className="font-display text-headline-display mb-6 animate-fade-up leading-tight" style={{ color: '#FFFFFF', animationDelay: '100ms' }}>
              We bring stories <br className="hidden md:block"/> and readers <span style={{ color: '#D4A853' }}>together.</span>
            </h1>
            <p className="text-body-lg leading-relaxed animate-fade-in mx-auto" style={{ color: 'rgba(255,255,255,0.85)', animationDelay: '200ms', maxWidth: '600px' }}>
              BookNest was built for those who believe the best part of reading is finding that next great book. We combine the warmth of a curated bookstore with the precision of modern AI.
            </p>
          </div>
        </div>

        {}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#FDF8F0"></path>
          </svg>
        </div>
      </section>

      {}
      <section className="section-container relative z-30 -mt-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl warm-shadow-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="font-display text-[2rem] md:text-[2.5rem] font-bold mb-1 transition-transform duration-300 group-hover:scale-110" style={{ color: '#1A2A3A' }}>
                {stat.value}
              </p>
              <p className="text-label-md" style={{ color: '#D4A853' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {}
      <section className="section-container py-16">
        <div className="text-center mb-16">
          <span className="text-label-md mb-4 block tracking-widest" style={{ color: '#D4A853' }}>
            WHAT WE BELIEVE
          </span>
          <h2 className="font-display text-headline-lg" style={{ color: '#1A2A3A' }}>
            Built on Purpose
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: 'rgba(26, 42, 58, 0.05)' }}
              >
                <Icon size={24} style={{ color: '#1A2A3A' }} />
              </div>
              <h3 className="font-display text-headline-sm mb-3 relative z-10" style={{ color: '#1A2A3A' }}>{title}</h3>
              <p className="text-body-md leading-relaxed relative z-10" style={{ color: '#8A7E75' }}>{description}</p>
            </article>
          ))}
        </div>
      </section>

      {}
      <section className="py-24 mt-12" style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF' }}>
        <div className="section-container">
          <div className="text-center mb-16">
            <span className="text-label-md mb-4 block tracking-widest" style={{ color: '#D4A853' }}>
              HOW IT WORKS
            </span>
            <h2 className="font-display text-headline-lg mb-4 text-white">
              Powered by Hybrid AI
            </h2>
            <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
              Behind the scenes, a sophisticated engine works tirelessly to understand your taste.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.5), transparent)' }} />
            
            <div className="space-y-24">
              {[
                { step: '01', title: 'KNN Collaborative Filtering', desc: 'Our model analyzes rating patterns across 1M+ data points to find structurally similar books.' },
                { step: '02', title: 'Fuzzy Title Matching', desc: 'Natural language matching ensures even partial or misspelled titles find the right recommendations.' },
                { step: '03', title: 'MongoDB Enrichment', desc: 'AI recommendations are enriched with full book metadata from our 270K-title database.' },
                { step: '04', title: 'Express API Layer', desc: 'A robust Node.js backend with circuit breaker patterns, rate limiting, and auto-refreshing auth.' },
              ].map(({ step, title, desc }, index) => (
                <div key={step} className={`relative flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  {}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg z-10 transition-transform duration-300 hover:scale-110" style={{ backgroundColor: '#D4A853', color: '#1A2A3A', border: '4px solid #1A2A3A' }}>
                    {step}
                  </div>
                  
                  {}
                  <div className="w-5/12" />
                  
                  {}
                  <div className="w-5/12">
                    <div className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                      <h4 className="font-display text-headline-sm mb-3" style={{ color: '#D4A853' }}>{title}</h4>
                      <p className="text-body-md text-white/80 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

