import { useEffect, useState } from 'react';

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('booknest_access_token');
    if (!token) { setLoading(false); return; }

    fetch('http://localhost:3001/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.username) setUsers([data]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-headline-lg" style={{ color: '#1A2A3A' }}>Users</h1>
      <p className="mt-2 text-body-sm" style={{ color: '#8A7E75' }}>
        Moderate account roles and monitor user activity status.
      </p>
      {loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl skeleton" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="mt-10 text-center py-10 rounded-xl" style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}>
          <p className="text-body-sm" style={{ color: '#8A7E75' }}>No users found.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {users.map((user) => (
            <article
              key={user._id}
              className="flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#1A2A3A', color: '#D4A853' }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#1A2A3A' }}>{user.username}</p>
                  <p className="text-body-sm" style={{ color: '#8A7E75' }}>{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-label-sm">
                <span
                  className="rounded-full px-3 py-1 font-semibold uppercase"
                  style={{ backgroundColor: 'rgba(212, 168, 83, 0.15)', color: '#D4A853' }}
                >
                  {user.role}
                </span>
                <span
                  className="rounded-full px-3 py-1 font-semibold uppercase"
                  style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                >
                  active
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
