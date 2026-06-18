'use client';

import React, { useState, useEffect } from 'react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const { msg, type } = e.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener('showToast', handleToast as EventListener);
    return () => window.removeEventListener('showToast', handleToast as EventListener);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map((toast) => {
        const icon = toast.type === 'success' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ) : toast.type === 'error' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        );
        const borderColor = toast.type === 'success' ? 'rgba(0,204,136,0.4)' : toast.type === 'error' ? 'rgba(255,68,102,0.4)' : 'rgba(0,229,255,0.3)';
        return (
          <div
            key={toast.id}
            style={{
              background: 'var(--bg3)',
              border: `1px solid ${borderColor}`,
              color: 'var(--white)',
              padding: '14px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              minWidth: 280,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: 'toastIn 0.3s ease',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            <span>{icon}</span>
            <span>{toast.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
