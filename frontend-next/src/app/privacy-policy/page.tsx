import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '70vh', padding: '140px 48px 80px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 48, marginBottom: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6 }}>
        Our privacy policy is currently being updated. Please contact our support team at <a href="mailto:support@timelion.com" style={{ color: 'var(--teal)' }}>support@timelion.com</a> if you have any questions about how we handle your data.
      </p>
    </div>
  );
}

