import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiBookmark, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const forceDarkText = true;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      const target = event.target as HTMLElement;
      if (searchOpen && !target.closest('form') && !target.closest('button[aria-label="Search"]')) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (browseRef.current && !browseRef.current.contains(event.target as Node)) {
        setIsBrowseOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Browse', path: '/explore', hasDropdown: true },
    { name: 'Recommendations', path: '/recommendations' },
    { name: 'Library', path: '/library' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: 'rgba(253, 248, 240, 0.97)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 1px 0 rgba(26, 42, 58, 0.08)',
      }}
    >
      <nav className="w-full px-0">
        <div className="flex items-center h-18 px-6">
          <Link
            to="/"
            className="flex items-center gap-3 focus-ring rounded-sm"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="/logo.png"
              alt="BookNest"
              className="h-9 w-auto"
            />
            <span className="font-display text-headline-sm transition-colors duration-200" style={{ color: forceDarkText ? '#1A2A3A' : '#FFFFFF' }}>
              BookNest
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 mx-auto">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  ref={browseRef}
                  onMouseEnter={() => setIsBrowseOpen(true)}
                  onMouseLeave={() => setIsBrowseOpen(false)}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `text-label-md transition-all duration-200 focus-ring rounded-sm flex items-center gap-1 ${
                        isActive 
                          ? (forceDarkText ? 'text-primary font-semibold' : 'text-white font-semibold')
                          : (forceDarkText ? 'text-text-secondary hover:text-primary' : 'text-white/70 hover:text-white')
                      }`
                    }
                    style={{ textDecoration: 'none' }}
                  >
                    {link.name}
                    <FiChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isBrowseOpen ? 'rotate-180' : ''}`}
                    />
                  </NavLink>
                  {isBrowseOpen && (
                    <div
                      className="absolute left-0 top-full mt-2 w-52 rounded-xl bg-white py-2 animate-slide-down"
                      style={{
                        border: '1px solid #E8E2D8',
                        boxShadow: '0 12px 32px rgba(26, 42, 58, 0.12)',
                      }}
                    >
                      <NavLink
                        to="/explore"
                        className="flex items-center gap-2 px-4 py-2.5 text-body-sm transition-colors duration-150"
                        style={{ color: '#2C2420', textDecoration: 'none' }}
                        onClick={() => setIsBrowseOpen(false)}
                      >
                        <span className="text-base">📚</span> All Books
                      </NavLink>
                      <NavLink
                        to="/explore?sort=rating"
                        className="flex items-center gap-2 px-4 py-2.5 text-body-sm transition-colors duration-150"
                        style={{ color: '#2C2420', textDecoration: 'none' }}
                        onClick={() => setIsBrowseOpen(false)}
                      >
                        <span className="text-base">⭐</span> Top Rated
                      </NavLink>
                      <hr style={{ borderColor: '#E8E2D8', margin: '4px 0' }} />
                      <div
                        className="flex items-center gap-2 px-4 py-2.5 text-body-sm"
                        style={{ color: '#8A7E75' }}
                      >
                        <span className="text-base">🔍</span> Filter by:
                      </div>
                      <NavLink
                        to="/explore?sort=rating"
                        className="flex items-center gap-2 px-4 py-2.5 text-body-sm transition-colors duration-150 pl-10"
                        style={{ color: '#2C2420', textDecoration: 'none' }}
                        onClick={() => setIsBrowseOpen(false)}
                      >
                        Genre
                      </NavLink>
                      <NavLink
                        to="/explore?sort=rating"
                        className="flex items-center gap-2 px-4 py-2.5 text-body-sm transition-colors duration-150 pl-10"
                        style={{ color: '#2C2420', textDecoration: 'none' }}
                        onClick={() => setIsBrowseOpen(false)}
                      >
                        Author
                      </NavLink>
                      <NavLink
                        to="/explore?sort=year"
                        className="flex items-center gap-2 px-4 py-2.5 text-body-sm transition-colors duration-150 pl-10"
                        style={{ color: '#2C2420', textDecoration: 'none' }}
                        onClick={() => setIsBrowseOpen(false)}
                      >
                        Publication Year
                      </NavLink>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-label-md transition-all duration-200 ${
                      isActive 
                        ? (forceDarkText ? 'text-primary font-semibold' : 'text-white font-semibold')
                        : (forceDarkText ? 'text-primary/80 hover:text-primary' : 'text-white/70 hover:text-white')
                    }`
                  }
                  style={{ textDecoration: 'none' }}
                >
                  {link.name}
                </NavLink>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 bg-transparent border-none cursor-pointer"
              style={{ color: forceDarkText ? '#1A2A3A' : 'rgba(255,255,255,0.7)' }}
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>

            {searchOpen && (
              <form onSubmit={handleSearch} className="animate-slide-down">
                <div
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2"
                  style={{ border: '1px solid #E8E2D8' }}
                >
                  <FiSearch size={16} style={{ color: '#8A7E75' }} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    className="w-48 outline-none bg-transparent text-body-sm"
                    style={{ color: '#2C2420' }}
                  />
                </div>
              </form>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-full transition-all duration-200 focus-ring warm-shadow"
                  style={{
                    paddingLeft: '4px',
                    paddingRight: '10px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E2D8',
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#1A2A3A',
                      color: '#FFFFFF',
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className="text-body-sm font-medium hidden xl:block"
                    style={{
                      color: '#2C2420',
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.username}
                  </span>
                  <FiChevronDown size={14} style={{ color: '#8A7E75' }} />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 rounded-xl bg-white py-1.5 animate-slide-down"
                    style={{
                      marginTop: '8px',
                      width: '200px',
                      border: '1px solid #E8E2D8',
                      boxShadow: '0 8px 24px rgba(26, 42, 58, 0.1)',
                    }}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-body-sm transition-colors duration-150"
                      style={{ color: '#2C2420', textDecoration: 'none' }}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiUser size={16} /> Profile
                    </Link>
                    <Link
                      to="/library"
                      className="flex items-center gap-3 px-4 py-2.5 text-body-sm transition-colors duration-150"
                      style={{ color: '#2C2420', textDecoration: 'none' }}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiBookmark size={16} /> My Library
                    </Link>
                    <hr style={{ borderColor: '#E8E2D8', margin: '4px 0' }} />
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm border-none bg-transparent cursor-pointer transition-colors duration-150"
                      style={{ color: '#C94A4A' }}
                    >
                      <FiLogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-body-sm font-medium transition-colors duration-200 focus-ring rounded-full"
                  style={{
                    color: forceDarkText ? '#1A2A3A' : '#FFFFFF',
                    textDecoration: 'none',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full text-body-sm font-medium transition-all duration-200 focus-ring"
                  style={{
                    backgroundColor: '#1A2A3A',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 focus-ring"
              style={{
                backgroundColor: forceDarkText ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
                border: forceDarkText ? '1px solid #E8E2D8' : '1px solid rgba(255,255,255,0.2)',
                color: forceDarkText ? '#1A2A3A' : '#FFFFFF',
              }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="lg:hidden mt-4 rounded-xl bg-white py-4 px-2 animate-slide-down"
            style={{
              border: '1px solid #E8E2D8',
              boxShadow: '0 8px 24px rgba(26, 42, 58, 0.1)',
            }}
          >
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg text-body-sm transition-colors duration-150 ${
                        isActive ? 'bg-primary/5 text-primary font-semibold' : 'text-text hover:bg-surface-warm'
                      }`
                    }
                    style={{ textDecoration: 'none' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                  {link.hasDropdown && (
                    <div className="ml-4 space-y-1 mb-1">
                      <NavLink to="/explore" className="block px-4 py-2 rounded-lg text-body-sm text-text-secondary hover:bg-surface-warm" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>📚 All Books</NavLink>
                      <NavLink to="/explore?sort=rating" className="block px-4 py-2 rounded-lg text-body-sm text-text-secondary hover:bg-surface-warm" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>⭐ Top Rated</NavLink>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-body-sm border-none bg-transparent cursor-pointer transition-colors duration-150"
                style={{ color: '#C94A4A' }}
              >
                <FiLogOut size={16} /> Sign out
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center px-4 py-3 rounded-full border text-body-sm font-medium transition-all duration-200"
                  style={{ color: '#1A2A3A', borderColor: '#E8E2D8', textDecoration: 'none' }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center px-4 py-3 rounded-full text-body-sm font-medium transition-all duration-200"
                  style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF', textDecoration: 'none' }}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

