'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    name: 'Dashboard', href: '/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    )
  },
  {
    name: 'Orders', href: '/orders',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
    )
  },
  {
    name: 'Products', href: '/products',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="5" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="19"/><line x1="5" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="19" y2="12"/></svg>
    )
  },
  {
    name: 'Add Product', href: '/add-product',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    )
  },
  {
    name: 'Stock', href: '/stock',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    )
  },
  {
    name: 'Reviews', href: '/reviews',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    )
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          fontFamily: 'var(--font-premium)',
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#f8fafc',
          lineHeight: 1.2,
        }}>
          TIME LION
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.18em',
          color: 'var(--teal)',
          textTransform: 'uppercase',
          marginTop: 4,
        }}>
          Admin Portal
        </div>
      </div>

      {/* Nav */}
      <nav style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: isActive ? 'var(--teal)' : 'var(--muted)',
                background: isActive ? 'rgba(25,211,197,0.07)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.02em',
                padding: '11px 14px',
                borderRadius: 10,
                transition: '0.2s ease',
                borderLeft: isActive ? '2px solid var(--teal)' : '2px solid transparent',
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--muted)', fontSize: 12, fontWeight: 600,
            textDecoration: 'none', letterSpacing: '0.03em',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--teal)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Store
        </a>

        <button
          onClick={() => {
            sessionStorage.removeItem('admin_auth');
            window.location.href = '/';
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: '#f43f5e', fontSize: 12, fontWeight: 600,
            textDecoration: 'none', letterSpacing: '0.03em',
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
