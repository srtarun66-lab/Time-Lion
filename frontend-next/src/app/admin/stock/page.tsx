'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function StockPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [edits, setEdits] = useState<Record<string, number>>({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      const list: any[] = [];
      snap.forEach(d => list.push({ _id: d.id, ...d.data() }));
      setProducts(list);
      // init edits with current stock values
      const init: Record<string, number> = {};
      list.forEach((p: any) => { init[p._id] = p.stock; });
      setEdits(init);
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to load products.', type: 'error' } }));
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const updateStock = async (id: string) => {
    setSaving(id);
    try {
      await updateDoc(doc(db, 'products', id), { stock: edits[id] });
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Stock updated!', type: 'success' } }));
      setProducts(products.map(p => p._id === id ? { ...p, stock: edits[id] } : p));
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Server error.', type: 'error' } }));
    }
    setSaving(null);
  };

  const saveAll = async () => {
    const dirtyIds = products
      .filter(p => edits[p._id] !== undefined && edits[p._id] !== p.stock)
      .map(p => p._id);
    if (dirtyIds.length === 0) return;
    setSavingAll(true);
    let successCount = 0;
    await Promise.all(
      dirtyIds.map(async (id) => {
        try {
          await updateDoc(doc(db, 'products', id), { stock: edits[id] });
          successCount++;
        } catch { /* skip */ }
      })
    );
    if (successCount > 0) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: `✓ ${successCount} product${successCount > 1 ? 's' : ''} updated!`, type: 'success' } }));
      setProducts(prev => prev.map(p => dirtyIds.includes(p._id) ? { ...p, stock: edits[p._id] } : p));
    } else {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Update failed. Is backend running?', type: 'error' } }));
    }
    setSavingAll(false);
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'var(--danger)';
    if (stock <= 5) return 'var(--gold)';
    return 'var(--success)';
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', cls: 'b-cancelled' };
    if (stock <= 5) return { label: 'Low Stock', cls: 'b-processing' };
    return { label: 'In Stock', cls: 'b-delivered' };
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * (edits[p._id] ?? p.stock)), 0);
  const outOfStock = products.filter(p => (edits[p._id] ?? p.stock) === 0).length;
  const lowStock = products.filter(p => { const s = edits[p._id] ?? p.stock; return s > 0 && s <= 5; }).length;

  return (
    <div className="fade-up">
      <div className="pg-title">Stock</div>
      <div className="pg-sub">Manage inventory levels for all products</div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
            Total Products
          </div>
          <div style={{ fontFamily: 'var(--font-premium)', fontSize: 34, fontWeight: 700, color: 'var(--text)' }}>
            {products.length}
          </div>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid rgba(255,68,102,0.2)', borderRadius: 16, padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--danger), transparent)' }} />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
            Out of Stock
          </div>
          <div style={{ fontFamily: 'var(--font-premium)', fontSize: 34, fontWeight: 700, color: 'var(--danger)' }}>
            {outOfStock}
          </div>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid rgba(245,197,66,0.2)', borderRadius: 16, padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
            Low Stock (≤5)
          </div>
          <div style={{ fontFamily: 'var(--font-premium)', fontSize: 34, fontWeight: 700, color: 'var(--gold)' }}>
            {lowStock}
          </div>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid rgba(25,211,197,0.2)', borderRadius: 16, padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--teal), transparent)' }} />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
            Inventory Value
          </div>
          <div style={{ fontFamily: 'var(--font-premium)', fontSize: 28, fontWeight: 700, color: 'var(--teal)' }}>
            ₹{totalValue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="cbox">
        <div className="cbox-hd">
          <h3>Inventory</h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={fetchProducts}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                color: 'var(--muted)', padding: '6px 14px', borderRadius: 8,
                cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600,
                transition: '0.2s ease',
              }}
            >
              ↻ Refresh
            </button>
            {(() => {
              const dirtyCount = products.filter(p => edits[p._id] !== undefined && edits[p._id] !== p.stock).length;
              return dirtyCount > 0 ? (
                <button
                  onClick={saveAll}
                  disabled={savingAll}
                  className="btn-primary"
                  style={{ padding: '7px 20px', fontSize: 12, borderRadius: 8 }}
                >
                  {savingAll ? (
                    <><span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Saving…</>
                  ) : (
                    <>↑ Save All ({dirtyCount})</>
                  )}
                </button>
              ) : null;
            })()}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Current Stock</th>
                <th>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', margin: '0 auto 12px',
                      border: '2px solid rgba(25,211,197,0.15)',
                      borderTopColor: 'var(--teal)',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>Loading inventory…</div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const currentStock = edits[p._id] ?? p.stock;
                  const { label, cls } = getStockLabel(currentStock);
                  const imgSrc = p.image || '';
                  const isDirty = edits[p._id] !== p.stock;

                  return (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <img
                              src={imgSrc} alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                          <span style={{ color: 'var(--text)', fontWeight: 500, fontSize: 13 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{(p.category || '').replace(/-/g, ' ')}</td>
                      <td style={{ color: 'var(--teal)', fontWeight: 600 }}>₹{p.price.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${cls}`}>{label}</span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-premium)', fontSize: 22, fontWeight: 700, color: getStockColor(p.stock) }}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            onClick={() => setEdits(prev => ({ ...prev, [p._id]: Math.max(0, (prev[p._id] ?? p.stock) - 1) }))}
                            style={{
                              width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)',
                              background: 'rgba(255,255,255,0.04)', color: 'var(--muted)',
                              cursor: 'pointer', fontSize: 16, lineHeight: 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >−</button>
                          <input
                            type="number"
                            value={edits[p._id] ?? p.stock}
                            min={0}
                            onChange={(e) => setEdits(prev => ({ ...prev, [p._id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                            style={{
                              width: 64, textAlign: 'center',
                              background: isDirty ? 'rgba(25,211,197,0.06)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isDirty ? 'rgba(25,211,197,0.3)' : 'var(--border)'}`,
                              color: isDirty ? 'var(--teal)' : 'var(--text)',
                              padding: '6px 8px', borderRadius: 8,
                              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                              outline: 'none', transition: '0.2s',
                            }}
                          />
                          <button
                            onClick={() => setEdits(prev => ({ ...prev, [p._id]: (prev[p._id] ?? p.stock) + 1 }))}
                            style={{
                              width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)',
                              background: 'rgba(255,255,255,0.04)', color: 'var(--muted)',
                              cursor: 'pointer', fontSize: 16, lineHeight: 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >+</button>
                        </div>
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
