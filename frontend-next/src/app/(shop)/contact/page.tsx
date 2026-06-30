'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: new Date().toISOString(),
        status: 'unread',
      });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content">

      {/* ── HERO ── */}
      <div className="page-hero" style={{ paddingBottom: 60 }}>
        <div className="label-tag" style={{ marginBottom: 20, display: 'inline-flex' }}>Get In Touch</div>
        <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: 16 }}>
          Contact <span className="text-teal">Us</span>
        </h1>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 100px' }}>

        {/* ── SECTION 1: About ── */}
        <section style={{ marginBottom: 56 }} aria-label="About our store">
          <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.9, marginBottom: 18 }}>
            At our store, customer satisfaction is our highest priority. We are committed to providing premium
            quality watches with trusted service, secure ordering, and quick customer support. Every product
            is carefully selected to ensure style, durability, and value for our customers.
          </p>
          <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.9, margin: 0 }}>
            We truly care about our customers and always strive to provide a smooth and safe shopping
            experience. Our support team is ready to assist you with product details, order tracking,
            delivery updates, and exclusive collection inquiries.
          </p>
        </section>

        {/* ── SECTION 2: Management Team ── */}
        <section style={{ marginBottom: 56 }} aria-labelledby="mgmt-heading">
          <h2 id="mgmt-heading" style={{
            fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 24,
            paddingBottom: 12, borderBottom: '1px solid var(--border)',
          }}>
            Management <span className="text-teal">Team</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { role: 'Founder & Chief Executive', name: 'Tarun SR' },
              { role: 'Executive', name: 'Arjun' },
              { role: 'Database Admin Executive Official', name: 'Anto Nirmal . T' },
            ].map((m, idx, arr) => (
              <div key={m.role} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 24px',
                background: idx % 2 === 0
                  ? 'rgba(201,168,76,0.04)'
                  : 'rgba(255,255,255,0.02)',
                borderRadius: idx === 0 ? '14px 14px 0 0' : idx === arr.length - 1 ? '0 0 14px 14px' : '0',
                border: '1px solid rgba(201,168,76,0.1)',
                borderTop: idx > 0 ? 'none' : '1px solid rgba(201,168,76,0.1)',
                flexWrap: 'wrap', gap: 8,
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {m.role}
                </span>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--gold)', fontSize: 15 }}>
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Contact Numbers ── */}
        <section style={{ marginBottom: 56 }} aria-labelledby="contact-numbers-heading">
          <h2 id="contact-numbers-heading" style={{
            fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 24,
            paddingBottom: 12, borderBottom: '1px solid var(--border)',
          }}>
            Contact <span className="text-teal">Numbers</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { number: '7418719580', display: '+91 74187 19580', label: 'Primary' },
              { number: '8124730074', display: '+91 81247 30074', label: 'Alternate' },
            ].map(p => (
              <a key={p.number} href={`tel:${p.number}`} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '22px 28px', borderRadius: 16, textDecoration: 'none',
                background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)',
                border: '1px solid rgba(201,168,76,0.18)',
                transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.3)';
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)';
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>📞</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{p.display}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: WhatsApp Orders ── */}
        <section style={{ marginBottom: 56 }} aria-labelledby="whatsapp-heading">
          <h2 id="whatsapp-heading" style={{
            fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 24,
            paddingBottom: 12, borderBottom: '1px solid var(--border)',
          }}>
            WhatsApp <span className="text-teal">Orders Available</span>
          </h2>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24, padding: '28px 32px', borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(37,211,102,0.07) 0%, rgba(37,211,102,0.02) 100%)',
            border: '1px solid rgba(37,211,102,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#25D366',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-sub)', lineHeight: 1.7, margin: 0, maxWidth: 480 }}>
                Customers can also place orders directly through{' '}
                <strong style={{ color: 'var(--text)' }}>WhatsApp</strong> for quick and convenient purchasing assistance.
              </p>
            </div>
            <a
              href="https://wa.me/917418719580?text=Hi%20Time%20Lion!%20I%20want%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.3)', flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Order on WhatsApp →
            </a>
          </div>
        </section>

        {/* ── SECTION 5: Exclusive Collections ── */}
        <section style={{ marginBottom: 56 }} aria-labelledby="exclusive-heading">
          <h2 id="exclusive-heading" style={{
            fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 24,
            paddingBottom: 12, borderBottom: '1px solid var(--border)',
          }}>
            ✨ Exclusive Collections <span className="text-teal">Available</span>
          </h2>
          <div style={{
            padding: '32px 36px', borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(201,168,76,0.04) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '50%', right: -40, transform: 'translateY(-50%)',
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} aria-hidden="true" />
            <p style={{ fontSize: 15, color: 'var(--text-sub)', lineHeight: 1.9, margin: '0 0 28px', position: 'relative', zIndex: 1, maxWidth: 660 }}>
              Discover our specially curated premium watch collections available{' '}
              <strong style={{ color: 'var(--text)' }}>exclusively through our store</strong>.
              We regularly update new arrivals, trending designs, classic editions, and limited collections
              for our valued customers.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              <Link href="/category/classic-metal" className="btn-primary" style={{ fontSize: 14 }}>
                Browse Collections →
              </Link>
              <a
                href="https://wa.me/917418719580?text=Hi%20Time%20Lion!%20I%20want%20to%20know%20about%20exclusive%20collections."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ fontSize: 14 }}
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: Why Choose Us ── */}
        <section style={{ marginBottom: 56 }} aria-labelledby="why-heading">
          <h2 id="why-heading" style={{
            fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 24,
            paddingBottom: 12, borderBottom: '1px solid var(--border)',
          }}>
            Why <span className="text-teal">Choose Us?</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { icon: '🏆', text: 'Premium Quality Products' },
              { icon: '🔒', text: 'Safe & Secure Ordering' },
              { icon: '⚡', text: 'Fast Customer Support' },
              { icon: '🤝', text: 'Trusted Service' },
              { icon: '💎', text: 'Stylish & Latest Collections' },
              { icon: '😊', text: 'Customer-Friendly Assistance' },
            ].map(item => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '18px 22px', borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'border-color 0.25s, transform 0.25s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>{item.icon}</div>
                <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 7: Thank You + Contact Form ── */}
        <section aria-label="Thank you and contact form">
          {/* Thank You Message */}
          <div style={{
            marginBottom: 48, padding: '28px 32px', borderRadius: 16,
            background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 15, color: 'var(--text-sub)', lineHeight: 1.8, margin: 0 }}>
              Thank you for choosing us and trusting our brand. We look forward to serving you with
              excellence and bringing you timeless style with every collection.
            </p>
          </div>

          {/* Contact Form */}
          <div style={{
            padding: '40px 40px', borderRadius: 24,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 26, marginBottom: 8 }}>Send a Message</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
              Fill the form below and we&apos;ll get back to you within 24 hours.
            </p>

            {submitted ? (
              <div style={{
                padding: '48px 32px', textAlign: 'center',
                background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)',
                borderRadius: 20,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}></div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 12, color: '#25D366' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                  Thank you! We&apos;ll reply within 24 hours. For faster support, WhatsApp us directly.
                </p>
                <a
                  href="https://wa.me/917418719580"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ marginTop: 24, background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}
                >
                  WhatsApp Us Now
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="contact-form-field">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input
                      id="contact-name" name="name" type="text" autoComplete="name"
                      placeholder="Your full name" value={form.name} onChange={handleChange}
                      style={errors.name ? { borderColor: '#f43f5e' } : {}}
                    />
                    {errors.name && <span style={{ color: '#f43f5e', fontSize: 12 }}>{errors.name}</span>}
                  </div>
                  <div className="contact-form-field">
                    <label htmlFor="contact-phone">Phone Number</label>
                    <input
                      id="contact-phone" name="phone" type="tel" autoComplete="tel"
                      placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input
                    id="contact-email" name="email" type="email" autoComplete="email"
                    placeholder="your@email.com" value={form.email} onChange={handleChange}
                    style={errors.email ? { borderColor: '#f43f5e' } : {}}
                  />
                  {errors.email && <span style={{ color: '#f43f5e', fontSize: 12 }}>{errors.email}</span>}
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-subject">Subject</label>
                  <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange}>
                    <option value="">Select a topic...</option>
                    <option value="order">Order Status / Tracking</option>
                    <option value="return">Return / Refund</option>
                    <option value="warranty">Warranty Claim</option>
                    <option value="product">Product Enquiry</option>
                    <option value="exclusive">Exclusive Collection Enquiry</option>
                    <option value="bulk">Bulk / Wholesale Order</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message" name="message" rows={5}
                    placeholder="Describe your query in detail..."
                    value={form.message} onChange={handleChange}
                    style={{ resize: 'vertical', ...(errors.message ? { borderColor: '#f43f5e' } : {}) }}
                  />
                  {errors.message && <span style={{ color: '#f43f5e', fontSize: 12 }}>{errors.message}</span>}
                </div>

                <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                  {submitting ? (
                    <>
                      <span style={{ width: 16, height: 16, border: '2px solid #0a0803', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                  Or for instant help,{' '}
                  <a href="https://wa.me/917418719580" target="_blank" rel="noopener noreferrer"
                    style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>
                    WhatsApp us directly →
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
