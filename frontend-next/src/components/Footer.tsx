'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '80px 48px 0' }}>
      <div className="footer-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 64, paddingBottom: 56, borderBottom: '1px solid var(--border)' }}>

        {/* Brand */}
        <div className="footer-brand" style={{ flex: '1 1 300px', maxWidth: 380, marginBottom: 24 }}>
          <div className="footer-brand-top" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
              background: 'linear-gradient(135deg, #1a1505, #2a1f08)',
              border: '1.5px solid rgba(201,168,76,0.4)',
              boxShadow: '0 0 14px rgba(201,168,76,0.15)',
            }}>
              <Image src="/logo.jpeg" alt="Time Lion Logo" width={48} height={48} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="footer-brand-name" style={{
                fontFamily: 'var(--font-premium)',
                fontWeight: 700,
                fontSize: 36,
                letterSpacing: '0.15em',
                background: 'linear-gradient(135deg, #e8c56a 0%, #c9a84c 50%, #a07830 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}>TIME LION</span>
            </div>
          </div>

          <p className="footer-brand-desc" style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 300, lineHeight: 1.7, marginBottom: 16 }}>
            Premium timepieces crafted for every wrist. Find the perfect balance of luxury, durability, and affordability right here.
          </p>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
            <a href="tel:7418719580" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-sub)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-sub)')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +91 74187 19580
            </a>
            <a href="tel:8124730074" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-sub)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-sub)')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +91 81247 30074
            </a>
            <a href="mailto:srtarun66@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-sub)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-sub)')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              srtarun66@gmail.com
            </a>
          </div>

          {/* Social Links */}
          <nav className="footer-social-row" aria-label="Social media links">

            <a
              href="https://wa.me/917418719580"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn"
              aria-label="Chat with Time Lion on WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>

          </nav>
        </div>

        {/* Menus Container */}
        <nav className="footer-menus" style={{ flex: '2 1 500px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 48, maxWidth: 700 }} aria-label="Footer navigation">
          {/* Shop */}
          <div className="footer-menu-col">
            <div className="footer-menu-title" style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Shop</div>
            <div className="footer-menu-links" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Classic Metal', href: '/category/classic-metal' },
                { label: 'Digital Mania', href: '/category/digital-mania' },
                { label: 'Special Combo', href: '/category/special-combo' },
                { label: 'New Arrivals', href: '/category/digital-mania' },
              ].map(l => (
                <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="footer-menu-col">
            <div className="footer-menu-title" style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Support</div>
            <div className="footer-menu-links" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Track Orders', href: '/track-order' },
                { label: 'FAQ & Returns', href: '/faq' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'WhatsApp', href: 'https://wa.me/917418719580' },
              ].map(l => (
                <Link key={l.label} href={l.href} className="footer-link"
                  {...(l.href.startsWith('https') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="footer-menu-col">
            <div className="footer-menu-title" style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Legal</div>
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
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar" style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} TIME LION. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/privacy-policy" className="legal-link">Privacy Policy</Link>
          <span style={{ color: 'var(--border)' }}>·</span>
          <Link href="/terms" className="legal-link">Terms</Link>
          <span style={{ color: 'var(--border)' }}>·</span>
          <Link href="/contact" className="legal-link">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
