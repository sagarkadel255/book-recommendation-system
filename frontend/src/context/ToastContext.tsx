import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const iconMap = {
    success: { icon: FiCheckCircle, color: '#1A2A3A', bg: 'rgba(212, 168, 83, 0.12)' },
    error: { icon: FiAlertCircle, color: '#C94A4A', bg: 'rgba(201, 74, 74, 0.08)' },
    info: { icon: FiInfo, color: '#8A7E75', bg: 'rgba(26, 42, 58, 0.04)' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const { icon: Icon, color } = iconMap[toast.type];
          return (
            <div
              key={toast.id}
              className="flex items-center gap-3 px-5 py-3.5 rounded-xl pointer-events-auto animate-slide-down warm-shadow-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', minWidth: '280px', maxWidth: '400px' }}
            >
              <Icon size={18} style={{ color, flexShrink: 0 }} />
              <span className="text-body-sm flex-1" style={{ color: '#2C2420' }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-surface-warm transition-colors bg-transparent border-none cursor-pointer"
                aria-label="Dismiss"
              >
                <FiX size={12} style={{ color: '#B0A79F' }} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
