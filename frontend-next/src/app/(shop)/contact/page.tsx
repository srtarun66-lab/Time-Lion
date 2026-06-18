'use client';
import React from 'react';

export default function ContactPage() {
  return (
    <div style={{ minHeight: '70vh', padding: '140px 48px 80px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 48, marginBottom: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>
        Contact Support
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6, marginBottom: 40 }}>
        We are here to provide full support for all your needs. For immediate assistance with your orders or inquiries, please call our dedicated support lines below. 
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        <a 
          href="tel:7418719580" 
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 12, 
            background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05))', 
            border: '1px solid rgba(201,168,76,0.3)', 
            padding: '16px 32px', borderRadius: 16, 
            fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, color: 'var(--teal)',
            textDecoration: 'none', transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          +91 7418719580
        </a>

        <a 
          href="tel:8124730074" 
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 12, 
            background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05))', 
            border: '1px solid rgba(201,168,76,0.3)', 
            padding: '16px 32px', borderRadius: 16, 
            fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, color: 'var(--teal)',
            textDecoration: 'none', transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          +91 8124730074
        </a>
      </div>
      
      <p style={{ color: 'var(--text-sub)', fontSize: 14, marginTop: 48 }}>
        Or email us anytime at <a href="mailto:support@timelion.com" style={{ color: '#fff', textDecoration: 'underline' }}>support@timelion.com</a>
      </p>
    </div>
  );
}

