import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy – Time Lion | How We Handle Your Data',
  description:
    'Read the Time Lion Privacy Policy to understand how we collect, use, and protect your personal data when you shop for premium watches online.',
  alternates: { canonical: 'https://www.timelion.in/privacy-policy' },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you place an order or create an account with Time Lion, we collect information such as your name, phone number, email address, shipping address, and payment details. We also collect device and usage data when you browse our website to improve your experience.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to process and deliver your orders, send order confirmations and tracking updates via SMS/email, respond to your enquiries, prevent fraud, and improve our website and services. We do not sell your personal information to third parties.`,
  },
  {
    title: '3. Order & Payment Data',
    content: `Payment transactions are processed securely through trusted payment gateways. We do not store your complete card or UPI details on our servers. All transactions are encrypted using industry-standard SSL/TLS protocols.`,
  },
  {
    title: '4. Cookies & Analytics',
    content: `We use cookies to keep you logged in, remember your cart, and analyse website traffic through tools like Google Analytics. You can disable cookies in your browser settings, though some features may not work correctly.`,
  },
  {
    title: '5. Data Sharing',
    content: `We share your name and address with our shipping partners (e.g., courier companies) solely for delivery purposes. We may share anonymized analytics data with service providers. We never sell or rent your data to marketers.`,
  },
  {
    title: '6. Data Security',
    content: `We implement industry-standard security measures including Firebase Security Rules, SSL encryption, and access controls to protect your personal data from unauthorized access, disclosure, or loss.`,
  },
  {
    title: '7. Your Rights',
    content: `You have the right to access, correct, or delete your personal data. You can also request to stop receiving marketing communications at any time by contacting us at support@timelion.in or via WhatsApp at +91 74187 19580.`,
  },
  {
    title: '8. Contact Us',
    content: `If you have questions about this Privacy Policy, please contact us at support@timelion.in or call +91 74187 19580. We are committed to addressing your concerns promptly.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="page-content">
      <div className="page-hero" style={{ paddingBottom: 48 }}>
        <h1 style={{ fontFamily: 'var(--font-head)' }}>Privacy <span className="text-teal">Policy</span></h1>
        <p style={{ marginTop: 14 }}>Last updated: June 2026</p>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '60px 24px 80px' }}>
        <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.8, marginBottom: 48 }}>
          At Time Lion, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect the information you provide when you shop with us at <strong style={{ color: 'var(--text)' }}>www.timelion.in</strong>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {sections.map((s, i) => (
            <section key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, marginBottom: 16, color: 'var(--text)' }}>{s.title}</h2>
              <p style={{ color: 'var(--text-sub)', lineHeight: 1.85, fontSize: 15 }}>{s.content}</p>
            </section>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '24px 28px', borderRadius: 16, background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            📧 Questions? Email us at{' '}
            <a href="mailto:support@timelion.in" style={{ color: 'var(--gold)', textDecoration: 'none' }}>support@timelion.in</a>
            {' '}or WhatsApp{' '}
            <a href="https://wa.me/917418719580" style={{ color: '#25D366', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">+91 74187 19580</a>
          </p>
        </div>
      </div>
    </div>
  );
}
