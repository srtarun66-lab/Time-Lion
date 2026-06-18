'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  return (
    <div style={{ paddingTop: 100, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 80 }}>
      <div className="login-card" style={{
        width: '100%', maxWidth: 440,
        padding: '32px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border)',
        borderRadius: '16px'
      }}>
        
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, marginBottom: 8, color: '#f8fafc', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32, textAlign: 'center' }}>Log in to access your account.</p>

        <button 
          onClick={loginWithGoogle}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            background: '#ffffff', color: '#000', border: 'none',
            padding: '12px 24px', borderRadius: 12,
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15,
            cursor: 'pointer', transition: 'all 0.3s ease',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
}

