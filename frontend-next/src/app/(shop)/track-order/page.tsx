'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

export default function TrackOrderPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAuthenticated && user?.phone) {
      fetchLatestOrder(user.phone, true);
      interval = setInterval(() => {
        fetchLatestOrder(user.phone, false);
      }, 5000);
    } else if (!isAuthenticated && user === null) {
      // Avoid loading indefinitely if not logged in
      setLoading(false);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const fetchLatestOrder = async (phone: string, showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const q = query(
        collection(db, 'orders'),
        where('phone', '==', phone)
      );
      const querySnapshot = await getDocs(q);
      const fetchedOrders: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ _id: doc.id, ...doc.data() });
      });
      // Sort by createdAt descending and take the first one
      fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (fetchedOrders.length > 0) {
        setOrder(fetchedOrders[0]);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error("Error fetching latest order:", err);
    }
    if (showSpinner) setLoading(false);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Processing': return { bg: 'rgba(201,168,76,0.12)', color: '#C9A84C' };
      case 'Confirmed':  return { bg: 'rgba(201,168,76,0.12)', color: 'var(--teal)' };
      case 'Shipped':    return { bg: 'rgba(100,100,255,0.12)', color: '#8888ff' };
      case 'Delivered':  return { bg: 'rgba(16,185,129,0.12)', color: '#10b981' };
      case 'Cancelled':  return { bg: 'rgba(244,63,94,0.12)',  color: '#f43f5e' };
      default:           return { bg: 'var(--border)', color: 'var(--text)' };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: 24, textAlign: 'center' }}>
        <div style={{ maxWidth: 400, width: '100%' }}>
          <div style={{ 
            width: 72, height: 72, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 0 20px rgba(201,168,76,0.1)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-premium)', fontSize: 32, marginBottom: 16, color: '#f8fafc', letterSpacing: '0.02em' }}>
            Track Your Order
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
            Please login to track your latest order.
          </p>
          <button 
            onClick={() => router.push('/login')} 
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Login to Track
          </button>
        </div>
      </div>
    );
  }

  const renderTimeline = () => {
    if (!order) return null;

    const statuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
    const currentStatusIdx = order.status === 'Cancelled' ? -1 : statuses.indexOf(order.status);

    return (
      <div style={{ marginTop: 40, position: 'relative', maxWidth: 800, margin: '40px auto 0' }}>
        {/* Background Line */}
        <div style={{ position: 'absolute', top: 24, left: 24, right: 24, height: 4, background: 'rgba(255,255,255,0.05)', zIndex: 0, borderRadius: 4 }} />
        
        {/* Progress Line */}
        {currentStatusIdx >= 0 && (
          <div style={{ 
            position: 'absolute', top: 24, left: 24, 
            width: `calc(${(currentStatusIdx / (statuses.length - 1)) * 100}% - 48px)`, 
            height: 4, background: 'linear-gradient(90deg, var(--teal-mid), var(--teal))', 
            zIndex: 1, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 4,
            boxShadow: '0 0 10px rgba(201,168,76,0.5)'
          }} />
        )}
        
        {order.status === 'Cancelled' ? (
          <div style={{ width: '100%', textAlign: 'center', color: '#f43f5e', fontFamily: 'var(--font-premium)', fontSize: 24, fontWeight: 600, padding: 40 }}>
            Order Cancelled
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {statuses.map((step, idx) => {
              const isCompleted = idx <= currentStatusIdx;
              const isActive = idx === currentStatusIdx;
              return (
                <div key={step} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 100 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: isCompleted ? 'var(--teal)' : 'var(--bg2)',
                    border: `3px solid ${isCompleted ? 'var(--teal)' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isCompleted ? '#000' : 'rgba(255,255,255,0.3)',
                    boxShadow: isActive ? '0 0 20px rgba(201,168,76,0.5)' : 'none',
                    transition: 'all 0.4s ease',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                  }}>
                    {isCompleted ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ) : (
                      <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-premium)' }}>{idx + 1}</span>
                    )}
                  </div>
                  <div style={{ 
                    color: isCompleted ? 'var(--text)' : 'var(--text-muted)', 
                    fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-premium)', 
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    textAlign: 'center',
                    opacity: isCompleted ? 1 : 0.5
                  }}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '80vh', paddingBottom: 80, paddingTop: 120 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', paddingLeft: 16, paddingRight: 16, marginBottom: 40, textAlign: 'center' }}>
        <h1 className="fade-up" style={{ fontFamily: 'var(--font-premium)', fontSize: 'clamp(32px, 5vw, 42px)', marginBottom: 12, letterSpacing: '0.05em', color: '#f8fafc', textTransform: 'uppercase' }}>Order Status</h1>
        <p className="fade-up" style={{ animationDelay: '0.1s', color: 'var(--gold)', fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Live Shipment Tracking</p>
      </div>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ 
              width: 56, height: 56, borderRadius: '50%', 
              border: '4px solid rgba(201,168,76,0.1)', 
              borderTopColor: 'var(--teal)', 
              animation: 'spin 1s ease-in-out infinite' 
            }} />
            <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
          </div>
        ) : !order ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg2)', borderRadius: 24, border: '1px solid var(--border)' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, marginBottom: 12 }}>No Active Orders</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 16 }}>You don't have any recent orders to track.</p>
            <Link href="/" className="btn-outline">Start Shopping</Link>
          </div>
        ) : (
          <div className="fade-up track-order-card" style={{
            background: 'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(10,10,10,0.98))',
            borderRadius: 24, 
            border: '1px solid rgba(201,168,76,0.15)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Glow */}
            <div style={{ position: 'absolute', top: -150, right: -150, width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Top Row (Order Info) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(201,168,76,0.2)', paddingBottom: 32, marginBottom: 32 }}>
              <div>
                <div style={{ color: 'var(--gold)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 8 }}>Order Reference</div>
                <div style={{ fontFamily: 'var(--font-premium)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
                  {order.orderId || order._id.slice(-8).toUpperCase()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--gold)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 8 }}>Date of Purchase</div>
                <div style={{ fontFamily: 'var(--font-premium)', fontSize: 18, fontWeight: 500, color: '#e2e8f0', letterSpacing: '0.05em' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 16 }}>Purchased Items</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {order.items.map((it:any, idx:number) => (
                  <Link href={it.productId ? `/product/${it.productId}` : '#'} key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s ease', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-premium)', fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>
                        {it.quantity}x
                      </div>
                      <div style={{ fontFamily: 'var(--font-premium)', fontSize: 18, fontWeight: 600, color: '#f8fafc', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{it.name}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-premium)', fontSize: 18, fontWeight: 600, color: 'var(--text-muted)' }}>
                      ₹{it.price.toLocaleString('en-IN')}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Row (Timeline) */}
            <div style={{ padding: '40px', background: 'rgba(0,0,0,0.3)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 10px var(--teal)' }} />
                <div style={{ color: '#fff', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'var(--font-premium)' }}>Live Status Tracking</div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 10px var(--teal)' }} />
              </div>
              {renderTimeline()}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
