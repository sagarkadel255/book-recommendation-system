import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateAvatar, updateProfile } from '../../services/authService';
import { FiCamera, FiEdit2, FiCheck, FiUser, FiMail, FiShield } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAvatarUrl = () => {
    if (user?.avatar) return `http://localhost:3001${user.avatar}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=1A2A3A&color=D4A853&size=150`;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('avatar', file);

      await updateAvatar(formData);
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (username === user?.username) {
      setIsEditing(false);
      return;
    }

    try {
      setError('');
      await updateProfile({ username });
      await refreshUser();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="w-full py-12">
      <div className="section-container">
        <div className="mb-10 animate-fade-in">
          <span className="text-label-md mb-3 block" style={{ color: '#D4A853' }}>
            YOUR PROFILE
          </span>
          <h1 className="font-display text-headline-lg" style={{ color: '#1A2A3A' }}>
            Account Settings
          </h1>
        </div>

        {error && (
          <div
            className="mb-6 p-4 rounded-lg text-body-sm animate-fade-in"
            style={{ backgroundColor: 'rgba(201, 74, 74, 0.08)', color: '#C94A4A' }}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="animate-stagger" style={{ animationDelay: '0ms' }}>
            <div
              className="p-8 rounded-xl text-center"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8' }}
            >
              <div
                className="relative group cursor-pointer mx-auto"
                onClick={() => fileInputRef.current?.click()}
                style={{ width: '120px', height: '120px' }}
              >
                <div
                  className={`w-full h-full rounded-full overflow-hidden transition-opacity ${
                    isUploading ? 'opacity-50' : ''
                  }`}
                  style={{ border: '3px solid #E8E2D8' }}
                >
                  <img
                    src={getAvatarUrl()}
                    alt={user?.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'rgba(26, 42, 58, 0.5)' }}
                >
                  <FiCamera style={{ color: '#FFFFFF' }} size={24} />
                </div>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-8 h-8 rounded-full animate-spin"
                      style={{
                        border: '3px solid #D4A853',
                        borderTopColor: 'transparent',
                      }}
                    />
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
              />

              <h2 className="font-display text-headline-md mt-5" style={{ color: '#1A2A3A' }}>
                {user?.username}
              </h2>
              <p className="text-body-sm mt-1" style={{ color: '#8A7E75' }}>
                {user?.email}
              </p>
              <div
                className="inline-block mt-3 px-3 py-1 rounded-full text-label-sm font-medium"
                style={{ backgroundColor: 'rgba(212, 168, 83, 0.15)', color: '#D4A853' }}
              >
                {user?.role}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 animate-stagger" style={{ animationDelay: '100ms' }}>
            <div
              className="p-8 rounded-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-headline-sm" style={{ color: '#1A2A3A' }}>
                  Account Details
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-body-sm font-medium transition-colors"
                    style={{ color: '#D4A853' }}
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={handleProfileUpdate}
                    className="flex items-center gap-2 text-body-sm font-medium px-3 py-1.5 rounded-full transition-all"
                    style={{ backgroundColor: 'rgba(212, 168, 83, 0.15)', color: '#D4A853' }}
                  >
                    <FiCheck size={14} /> Save
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-label-sm mb-1.5" style={{ color: '#8A7E75' }}>
                    <FiUser size={13} className="inline mr-1.5" />
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg outline-none text-body-sm transition-all"
                      style={{
                        border: '1px solid #E8E2D8',
                        backgroundColor: '#FAF6EF',
                        color: '#2C2420',
                      }}
                    />
                  ) : (
                    <p
                      className="px-4 py-2.5 rounded-lg text-body-sm"
                      style={{ backgroundColor: '#FAF6EF', color: '#2C2420' }}
                    >
                      {user?.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-label-sm mb-1.5" style={{ color: '#8A7E75' }}>
                    <FiMail size={13} className="inline mr-1.5" />
                    Email
                  </label>
                  <p
                    className="px-4 py-2.5 rounded-lg text-body-sm"
                    style={{ backgroundColor: '#FAF6EF', color: '#8A7E75', opacity: 0.7 }}
                  >
                    {user?.email}
                  </p>
                  <p className="text-caption mt-1" style={{ color: '#B0A79F' }}>
                    Email cannot be changed.
                  </p>
                </div>

                <div>
                  <label className="block text-label-sm mb-1.5" style={{ color: '#8A7E75' }}>
                    <FiShield size={13} className="inline mr-1.5" />
                    Role
                  </label>
                  <p
                    className="px-4 py-2.5 rounded-lg text-body-sm"
                    style={{ backgroundColor: '#FAF6EF', color: '#1A2A3A' }}
                  >
                    {user?.role}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8" style={{ borderTop: '1px solid #E8E2D8' }}>
                <h3 className="font-display text-headline-sm mb-4" style={{ color: '#C94A4A' }}>
                  Danger Zone
                </h3>
                <p className="text-body-sm mb-4" style={{ color: '#8A7E75' }}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  disabled
                  className="px-4 py-2 rounded-full text-label-sm font-medium transition-colors opacity-50 cursor-not-allowed"
                  style={{
                    backgroundColor: 'rgba(201, 74, 74, 0.08)',
                    color: '#C94A4A',
                    border: '1px solid rgba(201, 74, 74, 0.2)',
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
