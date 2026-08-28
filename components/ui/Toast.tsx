'use client';

import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: { bg: '#4a7c59', text: '#fff' },
  error: { bg: '#c0392b', text: '#fff' },
  info: { bg: '#2980b9', text: '#fff' },
  warning: { bg: '#e67e22', text: '#fff' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '360px',
        width: '100%',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          const color = colors[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 48, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                background: color.bg,
                color: color.text,
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <p style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '2px',
                  cursor: 'pointer',
                  color: 'inherit',
                  display: 'flex',
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
