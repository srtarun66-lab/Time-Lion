'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

const STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', ''];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('Processing');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    import('firebase/firestore').then(({ onSnapshot, collection }) => {
      setLoading(true);
      const unsubscribe = onSnapshot(collection(db, 'orders'), (snap) => {
        const list: any[] = [];
        snap.forEach(d => {
          const data = d.data();
          if (statusFilter && data.status !== statusFilter) return;
          list.push({ _id: d.id, ...data });
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(list);
        setLoading(false);
      }, (err) => {
        console.error(err);
        setLoading(false);
      });
      return () => unsubscribe();
    });
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const order = orders.find(o => o._id === id);

      if (order && newStatus === 'Delivered' && order.status !== 'Delivered') {
        const itemsToUpdate = order.items || [];
        for (const item of itemsToUpdate) {
          if (item.productId) {
            const productRef = doc(db, 'products', item.productId);
            const pDoc = await getDoc(productRef);
            if (pDoc.exists()) {
              const data = pDoc.data();
              const currentStock = data.stock || 0;
              const qty = item.quantity || 1;
              
              if (data.category === 'special-combo' && data.comboProductIds) {
                for (const comboId of data.comboProductIds) {
                  const comboRef = doc(db, 'products', comboId);
                  const cDoc = await getDoc(comboRef);
                  if (cDoc.exists()) {
                    const cStock = cDoc.data().stock || 0;
                    await updateDoc(comboRef, { stock: Math.max(0, cStock - qty) });
                  }
                }
              }
              const newStock = Math.max(0, currentStock - qty);
              await updateDoc(productRef, { stock: newStock });
            }
          }
        }
      }

      await updateDoc(doc(db, 'orders', id), { status: newStatus });
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: `Status → ${newStatus}`, type: 'success' } }));
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to update status.', type: 'error' } }));
    }
  };

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="pg-title">Orders</div>
          <div className="pg-sub">Update statuses and track deliveries</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search Order ID, Name..." 
            className="admin-input"
            style={{ width: 220, padding: '10px 14px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={() => fetchOrders(statusFilter, true)}
            style={{
              background: 'rgba(255,255,255,0.05)', color: 'var(--text)', border: '1px solid var(--border)',
              padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
              transition: '0.2s', display: 'flex', alignItems: 'center', gap: 8
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              background: statusFilter === s ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${statusFilter === s ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
              color: statusFilter === s ? 'var(--teal)' : 'var(--muted)',
              padding: '6px 16px',
              borderRadius: 40,
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              transition: '0.2s ease',
            }}
          >
            {s === '' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="cbox">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', margin: '0 auto 12px',
                      border: '2px solid rgba(201,168,76,0.15)',
                      borderTopColor: 'var(--teal)',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>Loading orders…</div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>No orders found.</td>
                </tr>
              ) : (
                orders.filter(o => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  const oid = (o.orderId || o._id.slice(-8)).toLowerCase();
                  return oid.includes(q) || (o.phone && o.phone.includes(q)) || (o.name && o.name.toLowerCase().includes(q));
                }).map(o => {
                  return (
                    <tr key={o._id}>
                      <td style={{ color: 'var(--teal)', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.05em' }}>
                        {o.orderId || o._id.slice(-8).toUpperCase()}
                      </td>
                      <td style={{ color: 'var(--text)', fontWeight: 500 }}>{o.name}</td>
                      <td>
                        <a href={`tel:${o.phone}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>{o.phone}</a>
                      </td>
                      <td style={{ fontSize: 12, maxWidth: 220 }}>
                        {o.items?.length ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {o.items.map((i: any, idx: number) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {i.image && <img src={i.image} alt={i.name} style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />}
                                <Link href={`/product/${i.productId}`} style={{ color: 'var(--text-sub)', textDecoration: 'none', transition: 'color 0.2s', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onMouseEnter={e => e.currentTarget.style.color='var(--teal)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-sub)'}>
                                  {i.name} ×{i.quantity || 1}
                                </Link>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-sub)' }}>{o.product}</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text)', fontWeight: 600 }}>₹{(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td>
                        <span style={{ color: o.paymentMode === 'Online' ? 'var(--gold)' : 'var(--muted)', fontWeight: 600, fontSize: 12 }}>
                          {o.paymentMode || 'COD'}
                        </span>
                        <div style={{ marginTop: 4 }}>
                          {o.paymentStatus === 'Paid' ? (
                            <span style={{ background: 'rgba(201,168,76, 0.1)', color: 'var(--teal)', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>PAID</span>
                          ) : (
                            <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--muted)', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{o.paymentStatus?.toUpperCase() || 'PENDING'}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge b-${(o.status || '').toLowerCase()}`}>{o.status}</span>
                      </td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            color: 'var(--text)',
                            border: '1px solid var(--border)',
                            padding: '6px 10px',
                            borderRadius: 8,
                            fontSize: 12,
                            cursor: 'pointer',
                            outline: 'none',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {o.status === 'Delivered' 
                            ? ['Delivered', 'Cancelled'].map(s => <option key={s} value={s} style={{ background: '#0f172a', color: '#f8fafc' }}>{s}</option>)
                            : ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s} style={{ background: '#0f172a', color: '#f8fafc' }}>{s}</option>)
                          }
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
