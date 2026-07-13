import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBook } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-16 px-4 relative"
      style={{
        backgroundImage: 'url(/login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,42,58,0.3) 0%, transparent 50%, rgba(26,42,58,0.15) 100%)' }} />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: '#1A2A3A' }}
          >
            <FiBook size={24} style={{ color: '#D4A853' }} />
          </div>
          <h1 className="font-display text-headline-lg" style={{ color: '#FFFFFF' }}>
            Welcome Back
          </h1>
          <p className="text-body-sm mt-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Sign in to continue your reading journey
          </p>
        </div>

        <div
          className="bg-white rounded-xl p-8 animate-fade-up"
          style={{ border: '1px solid #E8E2D8' }}
        >
          {error && (
            <div
              className="mb-6 p-4 rounded-lg text-body-sm"
              style={{ backgroundColor: 'rgba(201, 74, 74, 0.08)', color: '#C94A4A' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-label-sm mb-1.5" style={{ color: '#2C2420' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg transition-all outline-none text-body-sm"
                style={{
                  border: '1px solid #E8E2D8',
                  backgroundColor: '#FAF6EF',
                  color: '#2C2420',
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-label-sm mb-1.5" style={{ color: '#2C2420' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg transition-all outline-none text-body-sm"
                style={{
                  border: '1px solid #E8E2D8',
                  backgroundColor: '#FAF6EF',
                  color: '#2C2420',
                }}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-3 font-medium text-label-md transition-all focus-ring"
              style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-body-sm" style={{ color: '#8A7E75' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium transition-colors" style={{ color: '#D4A853' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
