'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const { wishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div style={{ paddingTop: 100, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          textAlign: 'center', 
          background: 'linear-gradient(145deg, var(--bg2), rgba(15,23,42,0.8))', 
          padding: '60px 50px', 
          borderRadius: 24, 
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          maxWidth: 480, width: '100%'
        }}>
          <div style={{ 
            width: 72, height: 72, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 0 20px rgba(201,168,76,0.1)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-premium)', fontSize: 32, marginBottom: 16, color: '#f8fafc', letterSpacing: '0.02em' }}>
            Exclusive Access
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
            Please login to view and manage your Wishlist.
          </p>
          <button 
            onClick={() => router.push('/login')} 
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--teal), var(--teal-dark))',
              color: '#fff', border: 'none',
              padding: '16px 24px', borderRadius: 12,
              fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 15,
              cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(201,168,76,0.25)',
              letterSpacing: '0.05em', textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(201,168,76,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.25)';
            }}
          >
            Authenticate Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 100, minHeight: '80vh', maxWidth: 1400, margin: '0 auto', paddingBottom: 80 }}>
      <div style={{ padding: '0 48px' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 40, marginBottom: 12 }}>Your Wishlist</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 40 }}>
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
        </p>

        {wishlist.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)', borderRadius: 22,
            background: 'var(--bg2)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤍</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, marginBottom: 8 }}>Your Wishlist is Empty</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              Browse our collection and save some premium timepieces!
            </p>
            <Link href="/" className="btn-outline">Browse Watches</Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {wishlist.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

