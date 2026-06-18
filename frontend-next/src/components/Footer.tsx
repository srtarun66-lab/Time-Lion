import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '80px 48px 0' }}>
      <div className="footer-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 64, paddingBottom: 56, borderBottom: '1px solid var(--border)' }}>
        
        {/* Brand */}
        <div className="footer-brand" style={{ flex: '1 1 300px', maxWidth: 400, marginBottom: 24 }}>
          <div className="footer-brand-top" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', 
              background: 'linear-gradient(135deg, #1a1505, #2a1f08)',
              border: '1.5px solid rgba(201,168,76,0.4)',
              boxShadow: '0 0 14px rgba(201,168,76,0.15)',
            }}>
              <Image src="/logo.jpeg" alt="Time Lion" width={48} height={48} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ 
                fontFamily: 'var(--font-premium)', 
                fontWeight: 700, 
                fontSize: 36, 
                letterSpacing: '0.15em', 
                background: 'linear-gradient(135deg, #e8c56a 0%, #c9a84c 50%, #a07830 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textTransform: 'uppercase',
                lineHeight: 1 
              }}>TIME LION</span>
            </div>
          </div>
          <p className="footer-brand-desc" style={{ color: 'var(--text-muted)', fontSize: 15, fontWeight: 300, lineHeight: 1.6 }}>
            Premium timepieces crafted for every wrist. Find the perfect balance of luxury, durability, and affordability right here.
          </p>
        </div>

        {/* Menus Container */}
        <div className="footer-menus" style={{ flex: '2 1 500px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 48, maxWidth: 700 }}>
          {/* Shop */}
          <div className="footer-menu-col">
            <div className="footer-menu-title" style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Shop</div>
            <div className="footer-menu-links" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[{ label: 'Classic Metal', href: '/category/classic-metal' }, { label: 'Digital Mania', href: '/category/digital-mania' }, { label: 'Special Combo', href: '/category/special-combo' }].map(l => (
                <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="footer-menu-col">
            <div className="footer-menu-title" style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Support</div>
            <div className="footer-menu-links" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Track Orders', href: '/orders' },
                { label: 'FAQ & Returns', href: '/faq' },
              ].map(l => (
                <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>
              ))}
              <Link href="/contact" className="footer-link">Contact Us</Link>
            </div>
          </div>

          {/* Legal & Admin */}
          <div className="footer-menu-col">
            <div className="footer-menu-title" style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Legal & Admin</div>
            <div className="footer-menu-links" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Owner Dashboard', href: '/admin' },
              ].map(l => (
                <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar" style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 0', display: 'flex', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} TIME LION. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

