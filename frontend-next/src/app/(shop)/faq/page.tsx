import type { Metadata } from 'next';
import React from 'react';
import FAQSection from '@/components/FAQSection';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ & Returns – Time Lion | Warranty, Delivery & Policy',
  description:
    'Find answers to common questions about Time Lion watches — delivery, returns, warranty, payment options, and more. 1-Year warranty on all watches.',
  alternates: { canonical: 'https://www.timelion.in/faq' },
};

export default function FAQPage() {
  return (
    <div className="page-content">
      <div className="page-hero">
        <div className="label-tag" style={{ marginBottom: 20, display: 'inline-flex' }}>Help Center</div>
        <h1 style={{ fontFamily: 'var(--font-head)' }}>FAQ & <span className="text-teal">Returns</span></h1>
        <p style={{ marginTop: 14 }}>
          Everything you need to know about your order, warranty, and returns
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 80px' }}>
        <FAQSection />

        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 24 }}>
            Still have questions? Our team is here to help.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary">Contact Support</Link>
            <a
              href="https://wa.me/917418719580?text=Hi%2C%20I%20have%20a%20question!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
