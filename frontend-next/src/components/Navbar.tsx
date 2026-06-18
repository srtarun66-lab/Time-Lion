'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, setIsCartOpen, wishlist } = useCart();
  const { isAuthenticated, logout, firebaseUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const links = [
    { name: 'Home', href: '/', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { name: 'Classic Metal', href: '/category/classic-metal', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path></svg> },
    { name: 'Digital Mania', href: '/category/digital-mania', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg> },
    { name: 'Special Combo', href: '/category/special-combo', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg> },
    { name: 'Track Orders', href: '/track-order', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled || menuOpen ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(24px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid var(--border)' : '1px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 72,
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>

        {/* ── Logo ── */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: '50%', overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a1505, #2a1f08)',
            border: '1.5px solid rgba(201,168,76,0.4)',
            boxShadow: '0 0 14px rgba(201,168,76,0.15)',
          }}>
            <Image src="/logo.jpeg" alt="Time Lion" width={32} height={32} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }} className="nav-brand-text">
            <span style={{
              fontFamily: 'var(--font-premium)',
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: '0.25em',
              background: 'linear-gradient(135deg, #e8c56a 0%, #c9a84c 50%, #a07830 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textTransform: 'uppercase',
            }}>
              Time Lion
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}
          className="desktop-nav">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ── Desktop Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} className="desktop-actions">

          {/* Wishlist */}
          <Link href="/wishlist" style={{ textDecoration: 'none' }}>
            <button className="nav-icon-btn" title="Wishlist" aria-label="Wishlist" style={{ position: 'relative' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlist.length > 0 && (
                <span style={{
                  position: 'absolute', top: -5, right: -5,
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#f43f5e', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{wishlist.length}</span>
              )}
            </button>
          </Link>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))',
              border: '1px solid var(--border-teal)',
              color: 'var(--teal)',
              padding: '9px 20px', borderRadius: 40, cursor: 'pointer',
              fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 13,
              letterSpacing: '0.05em', transition: 'var(--transition)',
              position: 'relative', marginLeft: 4,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, var(--teal), var(--teal-dark))';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))';
              e.currentTarget.style.color = 'var(--teal)';
              e.currentTarget.style.borderColor = 'var(--border-teal)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Cart
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -7, right: -7,
                background: '#f43f5e', color: 'white',
                fontSize: 10, fontWeight: 700,
                width: 20, height: 20, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(244,63,94,0.4)',
              }}>{cartCount}</span>
            )}
          </button>

          {/* Profile */}
          <div className="profile-menu-container" style={{ position: 'relative' }}>
            <Link href={isAuthenticated ? "/profile" : "/login"} style={{ textDecoration: 'none' }}>
              <button className="nav-icon-btn profile-icon-btn" title="My Account" aria-label="My Account" style={{ padding: isAuthenticated && firebaseUser?.photoURL ? 0 : undefined, overflow: 'hidden' }}>
                {isAuthenticated && firebaseUser?.photoURL ? (
                  <img src={firebaseUser.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} referrerPolicy="no-referrer" />
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
              </button>
            </Link>

            {isAuthenticated && (
              <div className="profile-dropdown" style={{
                position: 'absolute', top: '100%', right: 0,
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '8px 0', minWidth: 180,
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                display: 'flex', flexDirection: 'column',
                marginTop: 8, zIndex: 100,
                opacity: 0, visibility: 'hidden', transform: 'translateY(10px)',
                transition: 'all 0.3s ease'
              }}>
                <Link href="/profile" style={{ padding: '12px 20px', color: 'var(--text)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 12 }} className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal)' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Profile
                </Link>
                <Link href="/orders" style={{ padding: '12px 20px', color: 'var(--text)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 12 }} className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal)' }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg> Orders
                </Link>
                <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                <button onClick={() => { logout(); window.location.href = '/'; }} style={{ background: 'none', border: 'none', padding: '12px 20px', color: '#f43f5e', textAlign: 'left', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }} className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Right: Cart icon + Hamburger ── */}
        <div style={{ display: 'none', alignItems: 'center', gap: 8 }} className="mobile-actions">
          {/* Mobile Cart icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="nav-icon-btn"
            aria-label="Cart"
            style={{ position: 'relative' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                background: '#f43f5e', color: 'white',
                fontSize: 9, fontWeight: 700,
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-icon-btn hamburger-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Drawer ── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999,
        pointerEvents: menuOpen ? 'all' : 'none',
      }}>
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Drawer panel */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0,
          width: '80%', maxWidth: 320,
          background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          overflowY: 'auto',
        }}>

          {/* Drawer header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '80px 24px 24px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', 
                background: 'linear-gradient(135deg, #1a1505, #2a1f08)',
                border: '1.5px solid rgba(201,168,76,0.4)',
                boxShadow: '0 0 14px rgba(201,168,76,0.15)',
              }}>
                <Image src="/logo.jpeg" alt="Logo" width={44} height={44} style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                color: 'var(--text-sub)', width: 36, height: 36, borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <div style={{ flex: 1, padding: '16px 0' }}>
            <div style={{ padding: '8px 24px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Navigation
            </div>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 24px',
                    color: isActive ? 'var(--gold)' : 'var(--text-sub)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-head)', fontWeight: isActive ? 700 : 500,
                    fontSize: 16,
                    background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, color: isActive ? 'var(--gold)' : 'var(--text-muted)' }}>{link.icon}</span>
                  {link.name}
                  {isActive && (
                    <svg style={{ marginLeft: 'auto', opacity: 0.5 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  )}
                </Link>
              );
            })}

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--border)', margin: '16px 24px' }} />

            {/* Account section */}
            <div style={{ padding: '8px 24px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Account
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 24px',
                    color: pathname === '/profile' ? 'var(--gold)' : 'var(--text-sub)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-head)', fontWeight: 500, fontSize: 16,
                    borderLeft: pathname === '/profile' ? '3px solid var(--gold)' : '3px solid transparent',
                    background: pathname === '/profile' ? 'rgba(201,168,76,0.06)' : 'transparent',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  My Profile
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 24px',
                    color: 'var(--text-sub)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-head)', fontWeight: 500, fontSize: 16,
                    borderLeft: '3px solid transparent',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  Wishlist {wishlist.length > 0 && <span style={{ background: '#f43f5e', color: '#fff', borderRadius: 20, fontSize: 11, fontWeight: 700, padding: '1px 8px', marginLeft: 4 }}>{wishlist.length}</span>}
                </Link>
                <div style={{ padding: '16px 24px' }}>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); window.location.href = '/'; }}
                    style={{
                      width: '100%', padding: '14px',
                      background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                      color: '#f43f5e', borderRadius: 12,
                      fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 15,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '8px 24px 24px' }}>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', padding: '16px',
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dim))',
                    color: '#0a0803', borderRadius: 12,
                    fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15,
                    textDecoration: 'none', letterSpacing: '0.05em',
                    boxShadow: '0 6px 20px rgba(201,168,76,0.25)',
                  }}
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            color: 'var(--text-muted)', fontSize: 11,
            letterSpacing: '0.08em',
          }}>
            © TIME LION — Premium Watches
          </div>
        </div>
      </div>

    </>
  );
}
