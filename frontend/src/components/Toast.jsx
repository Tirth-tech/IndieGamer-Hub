import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

// ── Single Toast Item ─────────────────────────────────────────────────────────
const ICONS = {
  success: <CheckCircle size={20} />,
  error:   <XCircle    size={20} />,
  warning: <AlertTriangle size={20} />,
  info:    <Info       size={20} />,
};

const COLORS = {
  success: { border: '#39FF88', icon: '#39FF88', bg: 'rgba(57,255,136,0.08)', bar: '#39FF88' },
  error:   { border: '#FF4444', icon: '#FF6B6B', bg: 'rgba(255,68,68,0.08)',  bar: '#FF4444' },
  warning: { border: '#FFB000', icon: '#FFB000', bg: 'rgba(255,176,0,0.08)',  bar: '#FFB000' },
  info:    { border: '#FF6B00', icon: '#FF6B00', bg: 'rgba(255,107,0,0.08)',  bar: '#FF6B00' },
};

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving]  = useState(false);
  const c = COLORS[toast.type] || COLORS.info;

  useEffect(() => {
    // enter
    const t1 = setTimeout(() => setVisible(true), 10);
    // auto-dismiss
    const t2 = setTimeout(() => dismiss(), toast.duration || 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 380);
  };

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '12px',
        background: `linear-gradient(135deg, rgba(23,19,15,0.97) 0%, rgba(15,12,9,0.99) 100%)`,
        border: `1px solid ${c.border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${c.border}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
        backdropFilter: 'blur(20px)',
        cursor: 'pointer',
        overflow: 'hidden',
        minWidth: '320px',
        maxWidth: '420px',
        transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.92)',
        opacity: visible && !leaving ? 1 : 0,
        transition: leaving
          ? 'transform 0.38s cubic-bezier(0.4,0,1,1), opacity 0.38s ease'
          : 'transform 0.42s cubic-bezier(0.16,1,0.3,1), opacity 0.42s ease',
      }}
    >
      {/* Left colored bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
        background: `linear-gradient(180deg, ${c.bar}, ${c.bar}88)`,
        borderRadius: '12px 0 0 12px',
      }} />

      {/* Icon */}
      <div style={{
        color: c.icon,
        flexShrink: 0,
        marginTop: '1px',
        filter: `drop-shadow(0 0 6px ${c.icon}88)`,
      }}>
        {ICONS[toast.type]}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            fontSize: '0.92rem',
            color: '#fff',
            marginBottom: '3px',
            letterSpacing: '0.2px',
          }}>
            {toast.title}
          </div>
        )}
        <div style={{
          fontSize: '0.85rem',
          color: '#C4B5A5',
          lineHeight: '1.45',
        }}>
          {toast.message}
        </div>
      </div>

      {/* Close button */}
      <div style={{ color: '#555', flexShrink: 0, marginTop: '1px' }}>
        <X size={15} />
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: `${c.bar}33`,
      }}>
        <div style={{
          height: '100%',
          background: `linear-gradient(90deg, ${c.bar}, ${c.bar}88)`,
          animation: `toastProgress ${toast.duration || 4000}ms linear forwards`,
          boxShadow: `0 0 6px ${c.bar}`,
        }} />
      </div>
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title, duration }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, title = 'Success')  => show(msg, 'success', title),
    error:   (msg, title = 'Error')    => show(msg, 'error',   title),
    warning: (msg, title = 'Warning')  => show(msg, 'warning', title),
    info:    (msg, title = 'Info')     => show(msg, 'info',    title),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}>
        <style>{`
          @keyframes toastProgress {
            from { width: 100%; }
            to   { width: 0%;   }
          }
        `}</style>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
