import { useState, useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const SETTINGS_KEY = 'booknest_admin_settings';

const defaultSettings = [
  { id: 'walkthrough', label: 'Enable onboarding walkthrough for new readers', enabled: true },
  { id: 'digest', label: 'Send weekly digest notifications', enabled: true },
  { id: 'flag_low_rated', label: 'Flag low-rated books for editorial review', enabled: true },
  { id: 'avatars', label: 'Allow self-service avatar updates', enabled: true },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings((prev) =>
          prev.map((s) => ({ ...s, enabled: parsed[s.id] ?? s.enabled }))
        );
      }
    } catch {}
  }, []);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSave = () => {
    const obj: Record<string, boolean> = {};
    settings.forEach((s) => { obj[s.id] = s.enabled; });
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj));
    showToast('Settings saved successfully', 'success');
  };

  return (
    <div>
      <h1 className="font-display text-headline-lg" style={{ color: '#1A2A3A' }}>Platform Settings</h1>
      <p className="mt-2 text-body-sm" style={{ color: '#8A7E75' }}>
        Control operational switches for discovery, engagement, and moderation.
      </p>
      <div className="mt-6 space-y-3">
        {settings.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-all hover:bg-surface-warm"
            style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8E2D8' }}
          >
            <span className="text-body-sm font-medium" style={{ color: '#2C2420' }}>{item.label}</span>
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={() => toggleSetting(item.id)}
              className="h-4 w-4 rounded cursor-pointer"
              style={{ accentColor: '#D4A853' }}
            />
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-label-sm font-semibold transition-all focus-ring hover:opacity-90"
        style={{ backgroundColor: '#1A2A3A', color: '#FFFFFF' }}
      >
        <FiCheckCircle size={16} />
        Save changes
      </button>
    </div>
  );
}
