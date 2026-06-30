'use client';

import React, { useState } from 'react';

const faqs = [
  {
    question: 'What is your return and exchange policy?',
    answer:
      'We offer a 7-day easy return and exchange policy on all orders. If you are not satisfied with your purchase, simply contact our support team via WhatsApp or email within 7 days of delivery. The product must be in original condition with all packaging.',
  },
  {
    question: 'Do you offer a warranty on your watches?',
    answer:
      'Yes! All Time Lion watches come with a 1-year manufacturer warranty. This covers manufacturing defects and mechanical issues. The warranty does not cover physical damage, water damage (unless the watch is water-resistant), or normal wear and tear.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'We typically deliver within 2-5 business days across India. Metro cities like Chennai, Bangalore, Mumbai, and Delhi usually receive orders within 2-3 days. Remote areas may take up to 7 business days. You will receive a tracking link via SMS once your order is shipped.',
  },
  {
    question: 'Do you offer Cash on Delivery (COD)?',
    answer:
      'No, we do not offer Cash on Delivery (COD). All orders must be paid online via UPI, Credit/Debit Card, or Net Banking before confirmation. All online transactions are 100% secure.',
  },
  {
    question: 'Are your watches genuine and authentic?',
    answer:
      'Absolutely. All Time Lion watches are 100% genuine and sourced directly from trusted manufacturers. We do not sell replicas or counterfeit products. Each watch passes quality control before being shipped to you.',
  },
  {
    question: 'Can I buy watches as gifts with special packaging?',
    answer:
      'Yes! All our watches come in premium packaging, making them perfect gifts. If you need a personalized gift message or special packaging, please contact us on WhatsApp at +91 7418719580 before placing your order.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i));
  };

  // JSON-LD for FAQ page
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="faq-list" role="list">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`faq-item${openIndex === i ? ' open' : ''}`}
            role="listitem"
          >
            <button
              className="faq-question"
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
            >
              <span className="faq-question-text">{faq.question}</span>
              <span className="faq-chevron" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div
              className="faq-answer"
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
