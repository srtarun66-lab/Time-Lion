'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const STATES = [
  "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", 
  "Maharashtra", "Delhi", "Gujarat", "West Bengal", "Uttar Pradesh", "Other"
];

const TN_CITIES = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", 
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", 
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", 
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", 
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli (Trichy)", 
  "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", 
  "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar", "Other"
];

const OTHER_CITIES = [
  "Bangalore", "Kochi", "Hyderabad", "Mumbai", "New Delhi", "Ahmedabad", "Kolkata", "Pune", "Other"
];

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart, wishlist } = useCart();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  if (!user) return null; // Avoid hydration flash

  const handlePincodeChange = async (val: string) => {
    const numericVal = val.replace(/\D/g, '').slice(0, 6);
    setFormData((prev: any) => ({ ...prev, pincode: numericVal }));
    
    if (numericVal.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${numericVal}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev: any) => ({ ...prev, state: postOffice.State, city: postOffice.District }));
        } else {
          window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Invalid Pincode', type: 'error' } }));
        }
      } catch (err) {
        console.error("Pincode fetch error:", err);
      }
    }
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'users', user.id), formData, { merge: true });
      setIsEditing(false);
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Profile updated successfully!', type: 'success' } }));
    } catch (e: any) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to update profile: ' + e.message, type: 'error' } }));
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div style={{ paddingBottom: 40, paddingTop: 100 }}>
      <div className="profile-header-row" style={{ maxWidth: 1000, margin: '0 auto', paddingLeft: 16, paddingRight: 16, marginBottom: 24 }}>
        <div>
          <h1 className="fade-up" style={{ fontFamily: 'var(--font-premium)', fontSize: 'clamp(32px, 5vw, 42px)', marginBottom: 8, letterSpacing: '0.02em', color: '#f8fafc', textAlign: 'left' }}>Personal Details</h1>
          <p className="fade-up" style={{ animationDelay: '0.1s', color: 'var(--text-muted)', fontSize: 16, textAlign: 'left' }}>Manage your account information and preferences</p>
        </div>
        <button 
          onClick={logout} 
          className="fade-up"
          style={{
            background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(244,63,94,0.05))',
            border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e',
            padding: '12px 24px', borderRadius: 12,
            fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 15,
            cursor: 'pointer', transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(244,63,94,0.1)',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            animationDelay: '0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(244,63,94,0.2)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(244,63,94,0.1))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(244,63,94,0.1)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(244,63,94,0.05))';
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 16px' }}>
        <div className="profile-card" style={{
          background: 'linear-gradient(145deg, var(--bg2), rgba(15,23,42,0.8))',
          borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          padding: 24,
          animation: 'fadeUp 0.6s ease forwards'
        }}>
          <div className="profile-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 24, margin: 0 }}>Profile Information</h3>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 14 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                Edit Profile
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div className="profile-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Full Name</label>
                {isEditing ? (
                  <input type="text" className="modal-input" value={formData.fullName || ''} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 500, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>{user.fullName}</div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Email Address</label>
                {isEditing ? (
                  <input type="email" className="modal-input" value={formData.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }} />
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 500, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>{user.email || 'N/A'}</div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Phone Number</label>
                {isEditing ? (
                  <input type="tel" className="modal-input" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 500, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>{user.phone}</div>
                )}
              </div>
            </div>

            <div className="profile-grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Full Address</label>
                {isEditing ? (
                  <input type="text" className="modal-input" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 500, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>{user.address}</div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Password</label>
                {isEditing ? (
                  <input type="text" placeholder="Enter new password..." className="modal-input" value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 500, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>••••••••</div>
                )}
              </div>
            </div>

            <div className="profile-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Pincode</label>
                {isEditing ? (
                  <input type="text" className="modal-input" placeholder="6 Digits" value={formData.pincode || ''} onChange={(e) => handlePincodeChange(e.target.value)} maxLength={6} />
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 500, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>{user.pincode}</div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>State</label>
                {isEditing ? (
                  <select className="modal-input" value={formData.state || ''} onChange={(e) => setFormData({...formData, state: e.target.value, city: ''})}>
                    <option value="" disabled>Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 500, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>{user.state}</div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>City</label>
                {isEditing ? (
                  <select className="modal-input" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} disabled={!formData.state}>
                    <option value="" disabled>Select City</option>
                    {(formData.state === 'Tamil Nadu' ? TN_CITIES : formData.state ? OTHER_CITIES : []).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    {formData.city && formData.state !== 'Tamil Nadu' && !OTHER_CITIES.includes(formData.city) && (
                      <option value={formData.city}>{formData.city}</option>
                    )}
                  </select>
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 500, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>{user.city}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={handleSave} className="btn-primary" style={{ padding: '14px 32px' }}>Save Changes</button>
                <button onClick={handleCancel} className="btn-outline" style={{ padding: '14px 32px' }}>Cancel</button>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}

