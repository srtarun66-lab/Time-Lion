'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingReview, setDeletingReview] = useState<any>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      const allReviews: any[] = [];
      snap.forEach(docSnap => {
        const product = docSnap.data();
        if (product.reviews && Array.isArray(product.reviews)) {
          product.reviews.forEach((r: any) => {
            allReviews.push({
              ...r,
              productId: docSnap.id,
              productName: product.name,
              productImage: product.image
            });
          });
        }
      });
      allReviews.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setReviews(allReviews);
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to load reviews.', type: 'error' } }));
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const removeReview = async (productId: string, reviewId: string) => {
    try {
      const productRef = doc(db, 'products', productId);
      const pSnap = await getDoc(productRef);
      if (pSnap.exists()) {
        const product = pSnap.data();
        const updatedReviews = (product.reviews || []).filter((r: any) => r._id !== reviewId);
        await updateDoc(productRef, { reviews: updatedReviews });
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Review removed.', type: 'success' } }));
        fetchReviews();
      } else {
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Product not found.', type: 'error' } }));
      }
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Server error.', type: 'error' } }));
    }
  };

  return (
    <div className="fade-up">
      <div className="pg-title">Customer Reviews</div>
      <div className="pg-sub">Monitor and moderate product reviews</div>

      <div className="cbox" style={{ minHeight: 'calc(100vh - 220px)' }}>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', margin: '0 auto 12px',
                      border: '2px solid rgba(201,168,76,0.15)',
                      borderTopColor: 'var(--teal)',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>Loading reviews…</div>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', height: '60vh', color: 'var(--muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 }}>
                      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal)', opacity: 0.5 }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.05em' }}>No Reviews Found</div>
                      <div style={{ fontSize: 16, maxWidth: 450, margin: '0 auto', lineHeight: 1.5 }}>
                        There are no customer reviews on any products yet.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((r, idx) => {
                  const imgSrc = r.productImage || '';
                  return (
                    <tr key={idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 8,
                            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <img src={imgSrc} alt={r.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                          <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: 13, maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.productName}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ color: 'var(--text)', fontWeight: 600 }}>{r.userName}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 12 }}>{r.email}</div>
                      </td>
                      <td style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 12 }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} style={{ color: i < r.rating ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}>★</span>
                        ))}
                      </td>
                      <td style={{ maxWidth: 300 }}>
                        <div style={{ color: 'var(--text-sub)', fontSize: 13, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {r.comment}
                        </div>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                        {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <button
                          onClick={() => setDeletingReview(r)}
                          style={{
                            background: 'rgba(255,68,102,0.06)', border: '1px solid rgba(255,68,102,0.2)',
                            color: 'var(--danger)', padding: '6px 14px', borderRadius: 8,
                            cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', transition: '0.2s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,68,102,0.14)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,68,102,0.06)'}
                        >
                          Delete
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

      {deletingReview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '90%', maxWidth: 400, textAlign: 'center', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,68,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--danger)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>Delete Review?</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.5 }}>
              Are you sure you want to delete the review by <span style={{color: 'var(--text)', fontWeight: 600}}>{deletingReview.userName}</span>? This action cannot be undone.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button 
                onClick={() => setDeletingReview(null)}
                style={{ padding: '12px', background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 12, cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg2)'}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  removeReview(deletingReview.productId, deletingReview._id);
                  setDeletingReview(null);
                }}
                style={{ padding: '12px', background: 'var(--danger)', border: 'none', color: '#fff', borderRadius: 12, cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
