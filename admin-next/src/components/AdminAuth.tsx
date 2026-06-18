'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const ADMIN_EMAIL = 'jofrashivaa@gmail.com';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          setIsAuthenticated(true);
        } else {
          // If a non-admin logs in, immediately sign them out
          signOut(auth);
          setError('you are not an admin');
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setError('Login failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--teal-dim)', borderTopColor: 'var(--teal)', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(25,211,197,0.05) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: 420,
        padding: '48px 40px',
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1)'
      }}>
        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            fontFamily: 'var(--font-premium)', 
            fontSize: 36, 
            fontWeight: 700, 
            letterSpacing: '0.05em',
            color: 'var(--text)',
            lineHeight: 1.2,
            marginBottom: 8
          }}>
            TIME LION
          </div>
          <div style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 600 }}>
            Owner Dashboard
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <div style={{ 
              background: 'var(--danger-dim)', 
              color: 'var(--danger)', 
              padding: '12px 16px', 
              borderRadius: 8, 
              fontSize: 13, 
              textAlign: 'center',
              border: '1px solid rgba(255,68,102,0.2)'
            }}>
              {error}
            </div>
          )}

          <button 
            onClick={handleLogin}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              background: '#fff',
              color: '#000',
              border: 'none',
              padding: '16px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign In with Google
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'var(--muted)' }}>
          Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}
