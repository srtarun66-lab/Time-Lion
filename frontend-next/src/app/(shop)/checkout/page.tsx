'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, checkoutProduct, clearCart, changeQty, setCheckoutProduct } = useCart();
  const [loading, setLoading] = useState(false);
  
  // Steps: 1 = Address, 2 = Payment
  const [step, setStep] = useState(1);
  const [addressMode, setAddressMode] = useState<'SAVED' | 'NEW'>('NEW');

  // Form State for NEW address mode
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    if (user) {
      if (user.address) {
        setAddressMode('SAVED');
      }
      setFormData({
        name: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);

  // Auto fetch city based on Pincode
  useEffect(() => {
    if (formData.pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            const newCity = `${postOffice.District}, ${postOffice.State}`;
            setFormData(prev => ({ ...prev, city: newCity }));
          }
        })
        .catch(err => console.error("Error fetching pincode details", err));
    }
  }, [formData.pincode]);

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const items = checkoutProduct ? [checkoutProduct] : cart;

  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const handleQtyChange = (id: string, delta: number) => {
    const item = items.find(i => i._id === id);
    if (!item) return;

    const currentQty = 'quantity' in item ? (item as any).quantity : 1;
    const newQty = Math.max(1, currentQty + delta);

    if (delta > 0 && item.category === 'special-combo') {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Combo offer is limited to 1 per order.', type: 'error' } }));
      return;
    }

    if (delta > 0 && item.stock !== undefined && newQty > item.stock) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: `Only ${item.stock} pieces of ${item.name} available.`, type: 'error' } }));
      return;
    }

    if (checkoutProduct && checkoutProduct._id === id) {
      setCheckoutProduct({ ...checkoutProduct, quantity: newQty } as any);
    } else {
      changeQty(id, delta);
    }
  };

  const orderItems = items.map(item => ({
    ...item,
    quantity: 'quantity' in item ? (item as any).quantity : 1
  }));

  const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const checkStock = () => {
    for (const item of orderItems) {
      if (item.stock !== undefined && item.quantity > item.stock) {
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: `Only ${item.stock} pieces of ${item.name} available. Please reduce quantity.`, type: 'error' } }));
        return false;
      }
    }
    return true;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkStock()) return;
    if (!formData.name || !formData.phone || !formData.address) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Please fill all required fields.', type: 'error' } }));
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Enter a valid 10-digit phone number.', type: 'error' } }));
      return;
    }
    setStep(2);
  };

  const processPayment = async () => {
    const finalAddress = addressMode === 'SAVED' && user ? {
      name: user.fullName,
      phone: user.phone,
      email: user.email,
      address: user.address,
      city: user.city,
      pincode: user.pincode,
    } : formData;

    const orderDetails = {
      ...finalAddress,
      items: orderItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, image: i.image, productId: i._id })),
      product: orderItems[0]?.name || '',
      price: orderItems[0]?.price || 0,
      totalAmount: total,
      paymentMode: 'Online',
    };

    try {
      setLoading(true);
      
      // DUMMY PAYMENT BYPASS FOR TESTING
      setTimeout(async () => {
        try {
          // Direct Firebase Write Instead of API Verify Route
          const orderPayload = {
            ...orderDetails,
            userId: user?.id || null,
            status: 'Processing',
            paymentStatus: 'Paid',
            createdAt: new Date().toISOString(),
            orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000)
          };

          const docRef = await addDoc(collection(db, 'orders'), orderPayload);

          // Update user details if logged in and address mode is NEW
          if (user && user.id && addressMode === 'NEW') {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
              phone: finalAddress.phone || user.phone || '',
              address: finalAddress.address || user.address || '',
              city: finalAddress.city || user.city || '',
              pincode: finalAddress.pincode || user.pincode || ''
            }).catch(e => console.error("Failed to update user profile", e));
          }

          window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: `Dummy Payment Verified! Order: ${orderPayload.orderId}`, type: 'success' } }));
          if (!checkoutProduct) clearCart();
          router.push('/orders');
        } catch (err) {
           console.error(err);
           window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Server error during dummy verification.', type: 'error' } }));
        } finally {
          setLoading(false);
        }
      }, 1500);

    } catch (err) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Payment initialization failed.', type: 'error' } }));
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: '120px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: step >= 1 ? 'var(--teal)' : 'var(--text-muted)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 1 ? 'var(--teal)' : 'var(--bg3)', color: step >= 1 ? '#000' : 'var(--text-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</div>
          <span style={{ fontWeight: 600 }}>Address</span>
        </div>
        <div style={{ width: 40, height: 2, background: step >= 2 ? 'var(--teal)' : 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: step >= 2 ? 'var(--teal)' : 'var(--text-muted)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 2 ? 'var(--teal)' : 'var(--bg3)', color: step >= 2 ? '#000' : 'var(--text-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</div>
          <span style={{ fontWeight: 600 }}>Payment</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 60, alignItems: 'flex-start' }}>
        {/* Left Form Area (Now visually right) */}
        <div style={{ flex: '1 1 540px', order: 2 }}>
          {step === 1 && (
            <div className="fade-up" style={{ padding: '0 16px' }}>
              <h2 style={{ fontSize: 28, fontFamily: 'var(--font-head)', marginBottom: 32, color: 'var(--text)', letterSpacing: '0.02em' }}>Shipping Details</h2>
              
              {addressMode === 'SAVED' && user ? (
                <div>
                  <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03), transparent)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, marginBottom: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(25, 211, 197, 0.1)', border: '1px solid rgba(25, 211, 197, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 17, fontFamily: 'var(--font-head)' }}>Saved Location</div>
                        <div style={{ fontSize: 14, color: 'var(--text-sub)', marginTop: 4 }}>We found your saved address</div>
                      </div>
                    </div>
                    
                    <div style={{ background: 'var(--bg3)', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 16 }}>{user.fullName}</div>
                      <div style={{ color: 'var(--text-sub)', fontSize: 14, marginTop: 6 }}>{user.address}, {user.city} - {user.pincode}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        {user.phone}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <button 
                      onClick={() => setAddressMode('NEW')} 
                      style={{ flex: 1, padding: 16, background: 'var(--bg3)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg3)'}
                    >
                      Change Address
                    </button>
                    <button 
                      onClick={() => { if(checkStock()) setStep(2); }} 
                      className="btn-primary" 
                      style={{ flex: 2, padding: 16, fontSize: 16 }}
                    >
                      Deliver Here &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddressSubmit} style={{ animation: 'fadeUp 0.3s ease' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 8 }}>Full Name *</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your name" required style={{ width: '100%', padding: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 8 }}>Phone *</label>
                      <input type="tel" maxLength={10} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\\D/g, '').slice(0, 10)})} placeholder="10-digit number" required style={{ width: '100%', padding: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 8 }}>Email (Optional)</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="For order updates" style={{ width: '100%', padding: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)' }} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 8 }}>Full Address *</label>
                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="House no, Street, Area" required style={{ width: '100%', padding: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 8 }}>City</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City" style={{ width: '100%', padding: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 8 }}>Pincode</label>
                      <input type="text" maxLength={6} value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\\D/g, '').slice(0, 6)})} placeholder="6-digit pincode" style={{ width: '100%', padding: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)' }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 16 }}>
                    {user && user.address && (
                      <button 
                        type="button"
                        onClick={() => setAddressMode('SAVED')} 
                        style={{ padding: 16, background: 'var(--bg3)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: 16, fontSize: 16 }}>
                      Continue to Payment &rarr;
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="fade-up" style={{ padding: '0 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontFamily: 'var(--font-head)', margin: 0, color: 'var(--text)' }}>Secure Payment</h2>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Edit Address</button>
              </div>

              <div style={{ background: 'var(--bg3)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>Razorpay Secure Checkout</span>
                </div>
                <p style={{ color: 'var(--text-sub)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  You will be securely redirected to Razorpay to complete your purchase using Cards, UPI, or Netbanking. All transactions are fully encrypted.
                </p>
              </div>

              <button 
                onClick={processPayment} 
                disabled={loading}
                className="btn-primary" 
                style={{ width: '100%', padding: 20, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                {loading ? (
                   <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    Pay Securely
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Order Summary Area (Now visually left) */}
        <div style={{ flex: '1 1 380px', order: 1 }}>
          <div style={{ position: 'sticky', top: 120, background: 'linear-gradient(145deg, rgba(255,255,255,0.02), transparent)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: 18, margin: 0, fontFamily: 'var(--font-head)' }}>Order Summary</h3>
            </div>
            <div style={{ padding: 24, maxHeight: 400, overflowY: 'auto' }}>
              {orderItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                  <img src={item.image.startsWith('http') ? item.image : item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', fontFamily: 'var(--font-head)' }}>{item.name}</div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button type="button" disabled={item.category === 'special-combo'} onClick={() => handleQtyChange(item._id, -1)} style={{ background: 'transparent', border: 'none', color: item.category === 'special-combo' ? 'rgba(255,255,255,0.2)' : 'var(--text)', cursor: item.category === 'special-combo' ? 'not-allowed' : 'pointer', padding: '4px 10px', fontSize: 16 }}>-</button>
                        <span style={{ fontSize: 13, minWidth: 20, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                        <button type="button" disabled={item.category === 'special-combo'} onClick={() => handleQtyChange(item._id, 1)} style={{ background: 'transparent', border: 'none', color: item.category === 'special-combo' ? 'rgba(255,255,255,0.2)' : 'var(--text)', cursor: item.category === 'special-combo' ? 'not-allowed' : 'pointer', padding: '4px 10px', fontSize: 16 }}>+</button>
                      </div>
                      <div style={{ color: 'var(--teal)', fontWeight: 700, fontSize: 15 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 24, background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: 'var(--text-sub)', fontSize: 14 }}>
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, color: 'var(--text-sub)', fontSize: 14 }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--teal)' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', fontWeight: 700, fontSize: 20 }}>
                <span>Total</span>
                <span style={{ color: 'var(--teal)' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

