'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, getCartTotal, removeFromCart, changeQty, setCheckoutProduct } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isCartOpen) return null;

  const total = getCartTotal();
  const totalOriginal = cart.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const totalSavings = totalOriginal - total;

  return (
    <>
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          animation: 'toastIn 0.3s ease',
        }}
      />
      <div
        className="cart-sidebar"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 420,
          maxWidth: '100vw',
          height: '100vh',
          background: 'var(--bg2)',
          borderLeft: '1px solid rgba(0,229,255,0.15)',
          zIndex: 2001,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
          animation: 'slideInRight 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontFamily: 'var(--font-premium)', fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your Cart</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-sub)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text-sub)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {!isAuthenticated ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ 
              textAlign: 'center', 
              background: 'linear-gradient(145deg, var(--bg2), rgba(15,23,42,0.8))', 
              padding: '40px 30px', 
              borderRadius: 24, 
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
              width: '100%'
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
              <h2 style={{ fontFamily: 'var(--font-premium)', fontSize: 28, marginBottom: 16, color: '#f8fafc', letterSpacing: '0.02em' }}>
                Exclusive Access
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
                Please login to view your cart and checkout.
              </p>
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/login');
                }} 
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
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  </div>
                  <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 500, color: 'var(--text-sub)' }}>Your cart is empty</p>
                  <p style={{ fontSize: 13, marginTop: 8 }}>Looks like you haven't added anything yet.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id} style={{ 
                    display: 'flex', gap: 16, padding: 16, borderRadius: 16, 
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative', transition: 'border-color 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}>
                    <img
                      src={item.image.startsWith('http') ? item.image : item.image}
                      alt={item.name}
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-head)', color: 'var(--text)', paddingRight: 24 }}>{item.name}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                        <div style={{ color: 'var(--teal)', fontWeight: 700, fontSize: 16 }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div style={{ color: 'var(--text-muted)', fontSize: 12, textDecoration: 'line-through' }}>
                            ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 12, background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: 20, width: 'fit-content' }}>
                        <button
                          disabled={item.category === 'special-combo'}
                          onClick={() => changeQty(item._id, -1)}
                          style={{ background: 'none', border: 'none', color: item.category === 'special-combo' ? 'rgba(255,255,255,0.2)' : 'var(--text-sub)', width: 24, height: 24, cursor: item.category === 'special-combo' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'color 0.2s' }}
                          onMouseEnter={e => { if(item.category !== 'special-combo') e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { if(item.category !== 'special-combo') e.currentTarget.style.color = 'var(--text-sub)'; }}
                        >
                          &minus;
                        </button>
                        <span style={{ fontWeight: 600, fontSize: 13, minWidth: 20, textAlign: 'center', color: 'var(--text)' }}>{item.quantity}</span>
                        <button
                          disabled={item.category === 'special-combo'}
                          onClick={() => changeQty(item._id, 1)}
                          style={{ background: 'none', border: 'none', color: item.category === 'special-combo' ? 'rgba(255,255,255,0.2)' : 'var(--text-sub)', width: 24, height: 24, cursor: item.category === 'special-combo' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'color 0.2s' }}
                          onMouseEnter={e => { if(item.category !== 'special-combo') e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { if(item.category !== 'special-combo') e.currentTarget.style.color = 'var(--text-sub)'; }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,68,102,0.05)', border: '1px solid rgba(255,68,102,0.1)', color: 'var(--danger)', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,68,102,0.05)'; e.currentTarget.style.color = 'var(--danger)'; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '24px', background: 'rgba(10,15,28,0.95)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              {totalSavings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>Total Savings</span>
                  <span style={{ color: 'var(--success)', fontSize: 14, fontWeight: 700 }}>
                    -₹{totalSavings.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                <span style={{ color: 'var(--text-sub)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Subtotal</span>
                <span style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => {
                  if (cart.length === 0) return;
                  setCheckoutProduct(null);
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: 15, letterSpacing: '0.05em' }}
                disabled={cart.length === 0}
              >
                SECURE CHECKOUT &rarr;
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

