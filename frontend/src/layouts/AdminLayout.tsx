import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { FiBookOpen, FiLayout, FiSettings, FiUsers, FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: FiLayout },
  { label: 'Books', to: '/admin/books', icon: FiBookOpen },
  { label: 'Users', to: '/admin/users', icon: FiUsers },
  { label: 'Settings', to: '/admin/settings', icon: FiSettings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F0' }}>
      <div className="mx-auto flex w-full max-w-[1500px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside
          className="fixed inset-y-0 left-0 z-40 w-72 -translate-x-full transform rounded-none border-r p-5 transition-transform duration-300 lg:static lg:translate-x-0 lg:sticky lg:top-5 lg:h-fit lg:w-72 lg:rounded-xl lg:border"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E8E2D8',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2 focus-ring">
              <img src="/logo.png" alt="BookNest" className="h-7 w-auto" />
              <span className="font-display text-headline-sm" style={{ color: '#1A2A3A' }}>BookNest</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer"
              aria-label="Close sidebar"
            >
              <FiX size={18} />
            </button>
          </div>
          <div className="text-label-sm mb-6" style={{ color: '#D4A853' }}>
            Admin Panel
          </div>
          <nav className="space-y-1.5">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-body-sm font-medium transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-text-secondary hover:bg-surface-warm'
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#1A2A3A' : 'transparent',
                  color: isActive ? '#FFFFFF' : undefined,
                  textDecoration: 'none',
                })}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main
          className="w-full min-h-[80vh] rounded-xl p-5 sm:p-7"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E2D8',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 mb-5 rounded-lg text-body-sm font-medium transition-all"
            style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8', color: '#1A2A3A' }}
          >
            <FiMenu size={16} />
            Menu
          </button>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
