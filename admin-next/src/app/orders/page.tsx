'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', ''];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [isSilentLoading, setIsSilentLoading] = useState(false);

  const fetchOrders = async (status: string = '', showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setIsSilentLoading(true);
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const list: any[] = [];
      snap.forEach(d => {
        const data = d.data();
        if (status && data.status !== status) return;
        list.push({ _id: d.id, ...data });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to fetch orders.', type: 'error' } }));
    }
    if (showSpinner) setLoading(false);
    else setIsSilentLoading(false);
  };

  useEffect(() => {
    fetchOrders(statusFilter, true);
    const interval = setInterval(() => {
      fetchOrders(statusFilter, false);
    }, 5000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: `Status → ${newStatus}`, type: 'success' } }));
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to update status.', type: 'error' } }));
    }
  };

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div className="pg-title">Orders</div>
          <div className="pg-sub">Update statuses and track deliveries</div>
        </div>
        {isSilentLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--teal)', fontSize: 12, fontWeight: 600, animation: 'pulse 1.5s infinite' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--teal)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
            SYNCING LIVE
          </div>
        )}
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
                orders.map(o => {
                  const itemList = o.items?.length
                    ? o.items.map((i: any) => `${i.name} ×${i.quantity || 1}`).join(', ')
                    : o.product;
                  return (
                    <tr key={o._id}>
                      <td style={{ color: 'var(--teal)', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.05em' }}>
                        {o.orderId || o._id.slice(-8).toUpperCase()}
                      </td>
                      <td style={{ color: 'var(--text)', fontWeight: 500 }}>{o.name}</td>
                      <td>{o.phone}</td>
                      <td style={{ fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={itemList}>
                        {itemList}
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
                          {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                            <option key={s} value={s} style={{ background: '#0f172a', color: '#f8fafc' }}>{s}</option>
                          ))}
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
