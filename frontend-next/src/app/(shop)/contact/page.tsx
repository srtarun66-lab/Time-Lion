'use client';

import type { Metadata } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';

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
    // Simulate submission — replace with your actual API/email service
    await new Promise(resolve => setTimeout(resolve, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const contactMethods = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: 'Call Us',
      value: '+91 74187 19580',
      href: 'tel:7418719580',
      sub: 'Mon–Sat, 9am–7pm',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: 'Email Us',
      value: 'support@timelion.in',
      href: 'mailto:support@timelion.in',
      sub: 'We reply within 24 hours',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      label: 'WhatsApp',
      value: '+91 74187 19580',
      href: 'https://wa.me/917418719580?text=Hi%20Time%20Lion!%20I%20need%20help.',
      sub: 'Fastest response guaranteed',
    },
  ];

  return (
    <div className="page-content">
      {/* Hero */}
      <div className="page-hero" style={{ paddingBottom: 60 }}>
        <div className="label-tag" style={{ marginBottom: 20, display: 'inline-flex' }}>Get In Touch</div>
        <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: 16 }}>Contact <span className="text-teal">Support</span></h1>
        <p style={{ fontSize: 17, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
          We&apos;re here to help. Reach out via call, email, or WhatsApp — our team responds within hours.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* Contact Method Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 64 }}>
          {contactMethods.map((m) => (
            <a
              key={m.label}
              href={m.href}
              target={m.href.startsWith('http') ? '_blank' : undefined}
              rel={m.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                gap: 12, padding: '28px 28px',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, textDecoration: 'none',
                transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)',
              }}>{m.icon}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 17, color: 'var(--text)', marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.sub}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Form + Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, alignItems: 'start' }}>

          {/* Form */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, marginBottom: 8 }}>Send a Message</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Fill the form below and we&apos;ll get back to you within 24 hours.</p>

            {submitted ? (
              <div style={{
                padding: '48px 32px', textAlign: 'center',
                background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)',
                borderRadius: 20,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 12, color: '#25D366' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Thank you! We&apos;ll reply to your message within 24 hours. For faster support, WhatsApp us directly.</p>
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
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      style={errors.name ? { borderColor: '#f43f5e' } : {}}
                    />
                    {errors.name && <span style={{ color: '#f43f5e', fontSize: 12 }}>{errors.name}</span>}
                  </div>
                  <div className="contact-form-field">
                    <label htmlFor="contact-phone">Phone Number</label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    style={errors.email ? { borderColor: '#f43f5e' } : {}}
                  />
                  {errors.email && <span style={{ color: '#f43f5e', fontSize: 12 }}>{errors.email}</span>}
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-subject">Subject</label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a topic...</option>
                    <option value="order">Order Status / Tracking</option>
                    <option value="return">Return / Exchange</option>
                    <option value="warranty">Warranty Claim</option>
                    <option value="product">Product Enquiry</option>
                    <option value="bulk">Bulk / Wholesale Order</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="contact-form-field">
                  <label htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Describe your query in detail..."
                    value={form.message}
                    onChange={handleChange}
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
                  <a href="https://wa.me/917418719580" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>
                    WhatsApp us directly →
                  </a>
                </p>
              </form>
            )}
          </div>

          {/* Info Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Support Hours */}
            <div style={{
              padding: '28px 28px', borderRadius: 20,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04), transparent)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 18, marginBottom: 16 }}>Support Hours</h3>
              {[
                { day: 'Monday – Friday', hours: '9:00 AM – 7:00 PM' },
                { day: 'Saturday', hours: '10:00 AM – 5:00 PM' },
                { day: 'Sunday', hours: 'WhatsApp only' },
              ].map(h => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-sub)' }}>{h.day}</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{h.hours}</span>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div style={{
              padding: '28px 28px', borderRadius: 20,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04), transparent)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 18, marginBottom: 16 }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '📦 Track Your Order', href: '/orders' },
                  { label: '❓ FAQ & Returns', href: '/faq' },
                  { label: '⌚ Shop Watches', href: '/category/classic-metal' },
                ].map(l => (
                  <Link key={l.label} href={l.href} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 16px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid transparent',
                    color: 'var(--text-sub)', textDecoration: 'none', fontSize: 14, fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
                      e.currentTarget.style.color = 'var(--gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-sub)';
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
