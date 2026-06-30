import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Terms & Conditions – Time Lion | Purchase & Refund Policy',
  description:
    'Read the Time Lion Terms & Conditions covering purchase policies, delivery, returns, refunds, and warranty terms for all premium watch orders.',
  alternates: { canonical: 'https://www.timelion.in/terms' },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using www.timelion.in and placing an order, you agree to these Terms & Conditions. If you do not agree, please do not use our website or services. We reserve the right to modify these terms at any time.`,
  },
  {
    title: '2. Products & Pricing',
    content: `All watch prices on Time Lion are listed in Indian Rupees (₹) and include applicable taxes. We reserve the right to modify prices without prior notice. Product images are for illustrative purposes — minor colour variations may occur. We do our best to ensure all descriptions are accurate.`,
  },
  {
    title: '3. Orders & Payment',
    content: `Orders are confirmed once payment is received. We accept UPI, Credit/Debit Cards, and Net Banking. We do not offer Cash on Delivery (COD). All payments must be completed online prior to order confirmation. We reserve the right to cancel or refuse orders in cases of suspected fraud or unavailability.`,
  },
  {
    title: '4. Delivery Policy',
    content: `We aim to deliver within 2-7 business days depending on your location. Delivery timelines are estimates and may vary due to logistics delays or public holidays. Free shipping is available on orders above ₹999. For remote areas, additional charges may apply.`,
  },
  {
    title: '5. Returns & Refunds',
    content: `We accept only reasonable refund requests on a case-by-case basis. To initiate a refund, you must contact us via WhatsApp with clear images of the product showing the issue, and you will receive a verification call from our team. Refunds are accepted only if the product has no physical damage and is verified through our review process. We reserve the right to decline refund requests that do not meet our verification criteria.`,
  },
  {
    title: '6. Warranty',
    content: `All Time Lion watches come with a 1-year manufacturer warranty against manufacturing defects. The warranty does not cover: (a) physical damage, scratches, or breakage; (b) water damage for non-water-resistant models; (c) battery replacement; or (d) normal wear and tear.`,
  },
  {
    title: '7. Limitation of Liability',
    content: `Time Lion is not liable for indirect, incidental, or consequential damages arising from the use of our products or website. Our maximum liability is limited to the purchase price of the product in question.`,
  },
  {
    title: '8. Governing Law',
    content: `These terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of courts in Tamil Nadu, India.`,
  },
  {
    title: '9. Contact Us',
    content: `For any questions about these Terms & Conditions, please contact us at srtarun66@gmail.com or call +91 74187 19580 / +91 81247 30074. Our team is available Monday–Saturday, 9AM–7PM IST.`,
  },
];

export default function TermsPage() {
  return (
    <div className="page-content">
      <div className="page-hero" style={{ paddingBottom: 48 }}>
        <h1 style={{ fontFamily: 'var(--font-head)' }}>Terms & <span className="text-teal">Conditions</span></h1>
        <p style={{ marginTop: 14 }}>Last updated: June 2026</p>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '60px 24px 80px' }}>
        <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.8, marginBottom: 48 }}>
          These Terms & Conditions govern your use of <strong style={{ color: 'var(--text)' }}>www.timelion.in</strong> and all purchases made through our platform. Please read them carefully before placing an order.
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
            <a href="mailto:srtarun66@gmail.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>srtarun66@gmail.com</a>
            {' '}or WhatsApp{' '}
            <a href="https://wa.me/917418719580" style={{ color: '#25D366', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">+91 74187 19580</a>
          </p>
        </div>
      </div>
    </div>
  );
}
