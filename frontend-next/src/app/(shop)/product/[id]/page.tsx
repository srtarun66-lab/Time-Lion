'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { addToCart, setCheckoutProduct } = useCart();
  const { user, isAuthenticated, firebaseUser } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [photoMap, setPhotoMap] = useState<Record<string, string>>({});

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ _id: docSnap.id, ...docSnap.data() });
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkPurchase = async () => {
    if (!user) return;
    try {
      const ordersRef = collection(db, 'orders');
      let purchased = false;
      
      if (user.email) {
        const q = query(ordersRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const order = doc.data();
          if (order.items && order.items.some((item: any) => item._id === id || item.id === id)) {
            purchased = true;
          }
        });
      }

      if (!purchased && user.phone) {
        const q = query(ordersRef, where('phone', '==', user.phone));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const order = doc.data();
          if (order.items && order.items.some((item: any) => item._id === id || item.id === id)) {
            purchased = true;
          }
        });
      }

      setHasPurchased(purchased);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user && id) checkPurchase();
  }, [user, id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const map: Record<string, string> = {};
        usersSnap.forEach(doc => {
          const data = doc.data();
          if (data.email && data.photoURL) {
            map[data.email] = data.photoURL;
          }
        });
        setPhotoMap(map);
      } catch (err) {
        console.error('Error fetching users photoMap:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const review = {
        userName: user.fullName || 'User',
        email: user.email || user.phone,
        rating,
        comment,
        photoURL: firebaseUser?.photoURL || null,
        isVerifiedPurchase: hasPurchased,
        createdAt: new Date().toISOString()
      };
      
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        reviews: arrayUnion(review)
      });
      
      const docSnap = await getDoc(productRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedReviews = data.reviews || [];
        const newAvgRating = updatedReviews.length > 0 
          ? updatedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / updatedReviews.length
          : 0;
          
        await updateDoc(productRef, { rating: newAvgRating });
        setProduct({ _id: docSnap.id, ...data, rating: newAvgRating });
        
        setComment('');
        setRating(5);
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Review submitted successfully!', type: 'success' } }));
      }
    } catch (err) {
      console.error(err);
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to submit review', type: 'error' } }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 800);
  };

  if (loading) {
    return <div style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Product...</div>;
  }

  if (!product) {
    return <div style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>Product not found.</div>;
  }

  const reviews = product.reviews || [];
  const hasReviewed = user && reviews.some((r: any) => r.email === (user.email || user.phone));
  const imageUrl = product.image.startsWith('http') ? product.image : product.image;
  const disc = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="page-content" style={{ padding: '120px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', marginBottom: 24, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        &larr; Back
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, marginBottom: 60 }}>
        {/* Product Image */}
        <div style={{ flex: '1 1 400px', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
          <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 400 }} />
          {disc > 0 && (
            <div className="product-badge badge-sale" style={{ position: 'absolute', top: 24, right: 24, width: 'fit-content', padding: '6px 12px', borderRadius: 20 }}>
              -{disc}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontFamily: 'var(--font-premium)', margin: '0 0 16px 0', color: 'var(--text)' }}>
            {product.name}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ color: 'var(--gold)', fontSize: 20 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < Math.round(product.rating || 4.5) ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}>★</span>
              ))}
            </span>
            <span style={{ color: 'var(--text-sub)', fontSize: 16 }}>{(product.rating || 4.5).toFixed(1)} ({reviews.length} reviews)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-head)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: 20, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.8, marginBottom: 40 }}>
            {product.description || 'No description available for this product.'}
          </p>

          <div style={{ display: 'flex', gap: 16 }}>
            <button 
              className={`btn-primary ${cartAdded ? 'cart-added-anim' : ''}`}
              onClick={handleAddToCart}
              style={{ flex: 1, padding: '16px 24px', fontSize: 16 }}
            >
              {cartAdded ? '✓ Added' : 'Add to Cart'}
            </button>
            <button 
              className="btn-primary"
              onClick={() => { setCheckoutProduct(product); router.push('/checkout'); }}
              style={{ flex: 1, padding: '16px 24px', fontSize: 16, background: 'linear-gradient(135deg, var(--teal), var(--teal-dark))' }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40 }}>
        <h2 style={{ fontSize: 28, fontFamily: 'var(--font-head)', marginBottom: 32 }}>Customer Reviews</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
          {/* Reviews List */}
          <div style={{ flex: '1 1 500px' }}>
            {reviews.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: 'var(--text-sub)' }}>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {reviews.map((rev: any, idx: number) => {
                  const initials = rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U';
                  const formattedDate = new Date(rev.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                  return (
                    <div key={idx} style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))', padding: '28px 32px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          {/* Avatar */}
                          {(rev.photoURL || (rev.email && photoMap[rev.email])) ? (
                            <img src={rev.photoURL || photoMap[rev.email]} alt={rev.userName} referrerPolicy="no-referrer" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', background: 'var(--bg2)' }} />
                          ) : (
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-head)' }}>
                              {initials}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-head)' }}>
                              {rev.userName}
                              {rev.isVerifiedPurchase && (
                                <span style={{ fontSize: 10, background: 'rgba(25, 211, 197, 0.1)', color: 'var(--teal)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(25, 211, 197, 0.2)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                  ✓ Verified Buyer
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                              <div style={{ color: 'var(--gold)', fontSize: 14, display: 'flex', gap: 2 }}>
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span key={i} style={{ color: i < rev.rating ? 'var(--gold)' : 'rgba(255,255,255,0.1)' }}>★</span>
                                ))}
                              </div>
                              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formattedDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-sub)', lineHeight: 1.8, fontSize: 15, margin: '16px 0 0 64px' }}>
                        {rev.comment}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Review Form */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03), transparent)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: 20, marginBottom: 24, fontFamily: 'var(--font-head)' }}>Write a Review</h3>
              
              {!isAuthenticated ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <p style={{ color: 'var(--text-sub)', marginBottom: 20 }}>Please log in to share your thoughts.</p>
                  <button onClick={() => router.push('/login')} className="btn-primary" style={{ width: '100%' }}>Login</button>
                </div>
              ) : hasReviewed ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                  <div style={{ color: 'var(--teal)', fontSize: 32, marginBottom: 12 }}>✓</div>
                  <h4 style={{ color: 'var(--text)', margin: '0 0 8px 0', fontSize: 18 }}>Review Submitted</h4>
                  <p style={{ color: 'var(--text-sub)', margin: 0, fontSize: 14 }}>You have already reviewed this product. Thank you for your feedback!</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  {hasPurchased && (
                    <div style={{ background: 'rgba(25, 211, 197, 0.1)', border: '1px solid rgba(25, 211, 197, 0.3)', padding: 12, borderRadius: 12, marginBottom: 24 }}>
                      <p style={{ color: 'var(--teal)', margin: 0, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        You bought this item! Your review will be marked as a Verified Purchase.
                      </p>
                    </div>
                  )}
                  
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: 8, fontSize: 14 }}>Rating</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, padding: 0,
                            color: star <= rating ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                            transition: 'color 0.2s'
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: 8, fontSize: 14 }}>Comment</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      style={{
                        width: '100%', minHeight: 120, padding: 16,
                        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12, color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical'
                      }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%' }}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
