import { FiSearch, FiCpu, FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: FiSearch,
    title: 'Browse',
    description: 'Explore thousands of hand-curated titles across every genre imaginable.',
  },
  {
    icon: FiCpu,
    title: 'Recommend',
    description: 'Our AI suggests books tailored to your unique taste and reading history.',
  },
  {
    icon: FiBookOpen,
    title: 'Read',
    description: 'Build your personal library and track your literary journey.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 animate-fade-up" data-reveal-section style={{ animationDelay: '250ms' }}>
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="text-label-md mb-4 block" style={{ color: '#D4A853' }}>
            HOW IT WORKS
          </span>
          <h2 className="font-display text-headline-lg mb-4" style={{ color: '#1A2A3A' }}>
            Three Steps to Your Next Read
          </h2>
          <p className="text-body-md max-w-lg mx-auto" style={{ color: '#8A7E75' }}>
            Simple, intuitive, and powered by intelligent recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="text-center animate-stagger transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300"
                style={{ backgroundColor: '#1A2A3A', color: '#D4A853' }}
              >
                <feature.icon size={28} />
              </div>
              <h3 className="font-display text-headline-md mb-3" style={{ color: '#1A2A3A' }}>
                {feature.title}
              </h3>
              <p className="text-body-md" style={{ color: '#8A7E75' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-label-md transition-all focus-ring"
            style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF', textDecoration: 'none' }}
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </section>
  );
}
