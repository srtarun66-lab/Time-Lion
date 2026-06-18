'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
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

export default function OnboardingModal() {
  const { user } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived state to check if we need to show the modal
  const needsOnboarding = user && (!user.phone || !user.address || !user.pincode);

  if (!needsOnboarding) return null;

  const handlePincodeChange = async (val: string) => {
    const numericVal = val.replace(/\D/g, '').slice(0, 6);
    setPincode(numericVal);
    
    if (numericVal.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${numericVal}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setState(postOffice.State);
          setCity(postOffice.District);
        } else {
          window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Invalid Pincode', type: 'error' } }));
        }
      } catch (err) {
        console.error("Pincode fetch error:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address || !city || !state || !pincode) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Please fill in all fields', type: 'error' } }));
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Enter a valid 10-digit phone number', type: 'error' } }));
      return;
    }

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'users', user.id), {
        phone,
        address,
        city,
        state,
        pincode
      }, { merge: true });
      
      // Force reload to let AuthContext pick up the new user data
      window.location.reload();
    } catch (e: any) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to update profile', type: 'error' } }));
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-glass)', border: '1px solid var(--border)',
        padding: '32px', borderRadius: '16px', maxWidth: '480px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        animation: 'fadeUp 0.4s ease forwards'
      }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 24, marginBottom: 8, color: '#f8fafc', textAlign: 'center' }}>Complete Your Profile</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, textAlign: 'center', lineHeight: 1.5 }}>
          Welcome! Please provide your delivery details to finish setting up your account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1 }}>PHONE NUMBER</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <span style={{ padding: '0 16px', color: 'var(--text-muted)', fontWeight: 600, borderRight: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>+91</span>
              <input 
                type="tel" 
                placeholder="9876543210" 
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '14px', color: 'var(--text)', outline: 'none', fontSize: 15 }} 
                value={phone} 
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1 }}>FULL ADDRESS</label>
            <input 
              type="text" 
              placeholder="Flat/House No., Street, Area, Landmark" 
              className="modal-input" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', padding: '14px', borderRadius: 12, color: 'var(--text)', outline: 'none', fontSize: 15 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1 }}>PINCODE</label>
              <input 
                type="text" 
                placeholder="6-digit PIN" 
                className="modal-input" 
                value={pincode} 
                onChange={(e) => handlePincodeChange(e.target.value)} 
                maxLength={6} 
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', padding: '14px', borderRadius: 12, color: 'var(--text)', outline: 'none', fontSize: 15 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1 }}>STATE</label>
              <select className="modal-input" value={state} onChange={(e) => { setState(e.target.value); setCity(''); }} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', padding: '14px', borderRadius: 12, color: 'var(--text)', outline: 'none', fontSize: 15, appearance: 'none' }}>
                <option value="" disabled>Select State</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1 }}>CITY</label>
            <select className="modal-input" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', padding: '14px', borderRadius: 12, color: 'var(--text)', outline: 'none', fontSize: 15, appearance: 'none' }}>
              <option value="" disabled>Select City</option>
              {(state === 'Tamil Nadu' ? TN_CITIES : OTHER_CITIES).map(c => <option key={c} value={c}>{c}</option>)}
              {city && state !== 'Tamil Nadu' && !OTHER_CITIES.includes(city) && (
                <option value={city}>{city}</option>
              )}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              width: '100%', marginTop: 12,
              background: 'linear-gradient(135deg, var(--teal), var(--teal-dark))',
              color: '#fff', border: 'none',
              padding: '16px 24px', borderRadius: 12,
              fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 15,
              cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
              opacity: isSubmitting ? 0.7 : 1,
              letterSpacing: '0.05em', textTransform: 'uppercase'
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>

      </div>
    </div>
  );
}
