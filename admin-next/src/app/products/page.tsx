'use client';

import React, { useState, useEffect } from 'react';
import EditProductModal from '@/components/EditProductModal';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      const list: any[] = [];
      snap.forEach(d => list.push({ _id: d.id, ...d.data() }));
      setProducts(list);
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to load products.', type: 'error' } }));
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const removeProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Product removed.', type: 'success' } }));
      fetchProducts();
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Server error.', type: 'error' } }));
    }
  };

  return (
    <div className="fade-up">
      <div className="pg-title">Products</div>
      <div className="pg-sub">All products currently in the store</div>

      <div className="cbox" style={{ minHeight: 'calc(100vh - 220px)' }}>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Sale Price</th>
                <th>Original</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', margin: '0 auto 12px',
                      border: '2px solid rgba(25,211,197,0.15)',
                      borderTopColor: 'var(--teal)',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>Loading products…</div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', height: '60vh', color: 'var(--muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 }}>
                      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal)', opacity: 0.5 }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.05em' }}>No Products Found</div>
                      <div style={{ fontSize: 16, maxWidth: 450, margin: '0 auto', lineHeight: 1.5 }}>
                        Your store is currently empty. Go ahead and add some amazing watches to your collection!
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const imgSrc = p.image || '';
                  return (
                    <tr key={p._id}>
                      <td>
                        <div style={{
                          width: 52, height: 52, borderRadius: 10,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--border)',
                          overflow: 'hidden',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <img
                            src={imgSrc}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        </div>
                      </td>
                      <td style={{ color: 'var(--text)', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{(p.category || '').replace(/-/g, ' ')}</td>
                      <td style={{ color: 'var(--teal)', fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</td>
                      <td>
                        {p.originalPrice ? (
                          <span style={{ color: 'var(--muted)', textDecoration: 'line-through', fontSize: 12 }}>
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        ) : '—'}
                      </td>
                      <td>{p.stock}</td>
                      <td style={{ color: 'var(--gold)', fontWeight: 600 }}>★ {p.rating}</td>
                      <td style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                          onClick={() => setEditingProduct(p)}
                          style={{
                            background: 'rgba(25,211,197,0.06)',
                            border: '1px solid rgba(25,211,197,0.2)',
                            color: 'var(--teal)',
                            padding: '6px 14px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            fontFamily: 'var(--font-body)',
                            transition: '0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(25,211,197,0.14)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(25,211,197,0.06)';
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          style={{
                            background: 'rgba(255,68,102,0.06)',
                            border: '1px solid rgba(255,68,102,0.2)',
                            color: 'var(--danger)',
                            padding: '6px 14px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            fontFamily: 'var(--font-body)',
                            transition: '0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,68,102,0.14)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,68,102,0.06)';
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={() => { fetchProducts(); setEditingProduct(null); }}
        />
      )}
      {deletingProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '90%', maxWidth: 400, textAlign: 'center', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,68,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--danger)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>Remove Product?</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.5 }}>
              Are you sure you want to remove <span style={{color: 'var(--text)', fontWeight: 600}}>{deletingProduct.name}</span> from the store? This action cannot be undone.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button 
                onClick={() => setDeletingProduct(null)}
                style={{ padding: '12px', background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 12, cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg2)'}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  removeProduct(deletingProduct._id);
                  setDeletingProduct(null);
                }}
                style={{ padding: '12px', background: 'var(--danger)', border: 'none', color: '#fff', borderRadius: 12, cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
