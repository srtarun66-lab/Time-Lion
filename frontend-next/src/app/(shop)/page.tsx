import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import FAQSection from '@/components/FAQSection';
import { Product } from '@/context/CartContext';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, getCountFromServer } from 'firebase/firestore';

export const metadata: Metadata = {
  title: 'Premium Watches Online India | Time Lion – Luxury Timepieces',
  description:
    'Shop premium analog and digital watches at Time Lion. Explore Classic Metal, Digital Mania & Special Combo collections. 1-Year Warranty, Free Shipping above ₹999. COD Available.',
  alternates: {
    canonical: 'https://www.timelion.in',
  },
  openGraph: {
    title: 'Time Lion – Premium Watches Online India',
    description:
      'Luxury timepieces crafted for every wrist. Classic Metal, Digital Mania & Special Combo collections. Free shipping above ₹999.',
    url: 'https://www.timelion.in',
    images: [{ url: '/og-image.jpeg', width: 1200, height: 630, alt: 'Time Lion Premium Watches' }],
  },
};

async function getAllProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })) as unknown as Product[];
  } catch (error) {
    console.error('Error fetching products from Firebase:', error);
    return [];
  }
}

async function getSiteStats(): Promise<{ totalOrders: number }> {
  try {
    const coll = collection(db, 'orders');
    const snapshot = await getCountFromServer(coll);
    return { totalOrders: snapshot.data().count };
  } catch (error) {
    console.error('Error fetching stats from Firebase:', error);
    return { totalOrders: 0 };
  }
}

const testimonials = [
  {
    name: 'Arjun K.',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    text: 'Absolutely stunning watch. The quality exceeded my expectations — the finish is premium and it keeps perfect time. Perfect for formal occasions!',
    tag: '✓ Verified Buyer',
  },
  {
    name: 'Priya M.',
    location: 'Bangalore, Karnataka',
    rating: 5,
    text: 'Ordered the combo set — great value for the price. Fast delivery in 2 days and the packaging was beautiful. Will definitely order again!',
    tag: '✓ Verified Buyer',
  },
  {
    name: 'Ravi S.',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    text: 'The Digital Mania collection is absolutely fire. Bold, stylish, and super accurate. My friends keep asking where I got it from. 10/10 recommend!',
    tag: '✓ Verified Buyer',
  },
];

export default async function Home() {
  const [allProducts, siteStats] = await Promise.all([getAllProducts(), getSiteStats()]);
  const featuredProducts = allProducts.slice(0, 3);
  const newestProduct = allProducts.length > 0 ? allProducts[allProducts.length - 1] : null;

  const totalModels = allProducts.length;
  const totalOrders = siteStats.totalOrders;

  const ratedProducts = allProducts.filter((p: any) => p.rating > 0);
  const avgRating = ratedProducts.length > 0
    ? (ratedProducts.reduce((sum: number, p: any) => sum + p.rating, 0) / ratedProducts.length).toFixed(1)
    : '4.8';

  const customerDisplay = totalOrders >= 1000
    ? `${(totalOrders / 1000).toFixed(1).replace(/\.0$/, '')}K+`
    : totalOrders > 0 ? `${totalOrders}+` : '500+';

  const categories = [
    {
      href: '/category/classic-metal',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/>
          <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/>
        </svg>
      ),
      name: 'Classic Metal',
      count: allProducts.filter(p => p.category === 'classic-metal').length,
      desc: 'Timeless steel & titanium',
    },
    {
      href: '/category/digital-mania',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="6" y="5" width="12" height="14" rx="2" ry="2"/><line x1="16" y1="21" x2="8" y2="21"/>
          <line x1="16" y1="3" x2="8" y2="3"/><line x1="12" y1="10" x2="12" y2="14"/>
          <line x1="10" y1="12" x2="10" y2="12.01"/><line x1="14" y1="12" x2="14" y2="12.01"/>
        </svg>
      ),
      name: 'Digital Mania',
      count: allProducts.filter(p => p.category === 'digital-mania').length,
      desc: 'Smart displays & bold looks',
    },
    {
      href: '/category/special-combo',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
          <line x1="12" y1="22" x2="12" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>
      ),
      name: 'Special Combo',
      count: allProducts.filter(p => p.category === 'special-combo').length,
      desc: 'Best value bundles',
    },
  ];

  // JSON-LD for the homepage (Product listing)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.timelion.in' },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://www.timelion.in/category/classic-metal' },
    ],
  };

  return (
    <div className="page-content">

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* WhatsApp Sticky Button */}
      <a
        href="https://wa.me/917418719580?text=Hi%20Time%20Lion%2C%20I%27m%20interested%20in%20your%20watches!"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-sticky"
        aria-label="Chat with us on WhatsApp"
      >
        <svg className="whatsapp-sticky-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="whatsapp-sticky-label">Chat With Us</span>
      </a>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="hero-section" aria-label="Hero">

        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }} aria-hidden="true">
          <div style={{
            position: 'absolute', top: '10%', right: '5%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)',
            filter: 'blur(40px)', animation: 'glowPulse 8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '5%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)',
            filter: 'blur(60px)', animation: 'glowPulse 10s ease-in-out infinite 2s',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px', opacity: 0.4,
          }} />
        </div>

        <div className="hero-container">

          {/* LEFT: Text Content */}
          <div className="hero-left slide-left" style={{ animationDelay: '0.1s' }}>

            {/* Badge */}
            <div className="label-tag" style={{ marginBottom: 24 }}>
              <span className="label-dot" aria-hidden="true" />
              Premium Watch Store — India&apos;s Finest
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(44px, 5.5vw, 80px)',
              fontWeight: 900, lineHeight: 1.25, letterSpacing: '-0.03em', marginBottom: 16,
            }}>
              <span className="reveal-text"><span style={{ animationDelay: '0.15s' }}>Crafted For</span></span>
              <span className="reveal-text"><span className="text-teal" style={{ animationDelay: '0.25s' }}>Every Second.</span></span>
            </h1>

            <h2 className="fade-up" style={{
              fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 400, color: 'var(--gold)', letterSpacing: '0.02em',
              lineHeight: 1.4, paddingBottom: '4px', marginBottom: 20, animationDelay: '0.35s',
            }}>
              Luxury Meets Precision.
            </h2>

            <p className="fade-up" style={{
              fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.8, maxWidth: 480,
              fontWeight: 300, marginBottom: 32, animationDelay: '0.45s',
            }}>
              Discover premium analog and digital watches designed for style, performance, and elegance — crafted for those who know the value of every second.
            </p>

            {/* CTA Buttons */}
            <div className="fade-up hero-btns" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animationDelay: '0.55s' }}>
              <Link href="/category/classic-metal" className="btn-primary" style={{ fontSize: 14 }}>
                Shop Collection
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link href="/category/special-combo" className="btn-outline" style={{ fontSize: 14 }}>
                Explore Combos
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="trust-strip fade-up" style={{ animationDelay: '0.65s', justifyContent: 'flex-start' }}>
              {[
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                  label: '1-Year Warranty',
                },
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
                  label: 'Free Shipping ₹999+',
                },
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
                  label: 'Secure Payment',
                },
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
                  label: 'Easy Returns',
                },
              ].map(badge => (
                <div key={badge.label} className="trust-badge">
                  {badge.icon}
                  {badge.label}
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="fade-up hero-stats" style={{
              display: 'flex', gap: 36, marginTop: 32, animationDelay: '0.75s',
              paddingTop: 24, borderTop: '1px solid var(--border)',
            }}>
              {[
                { num: customerDisplay, label: 'Happy Customers' },
                { num: `${totalModels}`, label: 'Watch Models' },
                { num: `${avgRating}★`, label: 'Avg Rating' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800, color: 'var(--gold)', letterSpacing: '-0.02em' }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Watch Showcase */}
          <div className="hero-right slide-right" style={{ animationDelay: '0.2s' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute', inset: -40, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 65%)',
                animation: 'glowPulse 4s ease-in-out infinite',
              }} aria-hidden="true" />
              <div style={{
                position: 'relative', zIndex: 1,
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
                mixBlendMode: 'screen',
              }}>
                <Image
                  src="/hero.jpeg"
                  alt="Premium luxury watch from Time Lion collection"
                  width={460}
                  height={520}
                  style={{ objectFit: 'cover', borderRadius: 16 }}
                  priority
                />
                <div style={{
                  width: 160, height: 28, marginTop: -10, marginLeft: 60,
                  background: 'radial-gradient(ellipse, var(--teal) 0%, transparent 70%)',
                  filter: 'blur(18px)', opacity: 0.12,
                }} aria-hidden="true" />
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SHOP BY STYLE
      ═══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section" aria-labelledby="shop-by-style-heading">
          <div className="section-title-row">
            <div>
              <h2 id="shop-by-style-heading" style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)' }}>Shop By Style</h2>
            </div>
            <span className="section-title-sub">Find your perfect timepiece</span>
          </div>

          <div className="category-grid">
            {categories.map((cat, i) => (
              <Link key={cat.name} href={cat.href} className="glass-panel hover-lift category-card"
                style={{
                  borderRadius: 16, textDecoration: 'none', color: 'inherit',
                  position: 'relative', overflow: 'hidden',
                  animation: `fadeUp 0.6s var(--ease) both`,
                  animationDelay: `${0.1 + i * 0.1}s`,
                }}>
                <div className="cat-icon-wrap" style={{ color: 'var(--gold)', marginBottom: 16, padding: 12, background: 'rgba(201, 168, 76, 0.08)', borderRadius: 12, display: 'inline-flex' }} aria-hidden="true">{cat.icon}</div>
                <div className="cat-name" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{cat.name}</div>
                <div className="cat-desc" style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 300, marginBottom: 16 }}>{cat.desc}</div>
                <div className="cat-count" style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>{cat.count} Items →</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--teal), transparent)', opacity: 0 }} className="hover-line" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>


      {/* ═══════════════════════════════════════════════════════════
          STATS SECTION
      ═══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Our Numbers</h2>
          <div className="stats-section">
            {[
              { num: customerDisplay, label: 'Happy Customers', icon: '😊' },
              { num: `${totalModels}+`, label: 'Watch Models', icon: '⌚' },
              { num: `${avgRating}★`, label: 'Average Rating', icon: '⭐' },
              { num: '2 Days', label: 'Avg Delivery Time', icon: '🚀' },
            ].map(s => (
              <div key={s.label} className="stat-block">
                <div style={{ fontSize: 28, marginBottom: 8 }} aria-hidden="true">{s.icon}</div>
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>


      {/* ═══════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="featured-products-heading">
          <div className="section-header" style={{ marginBottom: 48 }}>
            <h2 id="featured-products-heading" style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)' }}>
              Featured <span className="text-teal">Products</span>
            </h2>
            <p>Handpicked timepieces just for you</p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="product-grid-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product as any} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px', background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)' }}>
              Check back soon for new arrivals.
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/category/classic-metal" className="btn-outline">
              View All Watches
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </section>
      </ScrollReveal>


      {/* ═══════════════════════════════════════════════════════════
          NEW ARRIVALS BANNER
      ═══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="arrival-section" style={{ maxWidth: 1400, margin: '0 auto' }} aria-labelledby="new-arrivals-heading">
          <div className="arrival-banner-inner" style={{
            borderRadius: 28,
            background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
            border: '1px solid var(--border)',
            position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 40,
          }}>
            <div style={{
              position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
              width: 360, height: 360, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} aria-hidden="true" />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 560 }}>
              <h2 id="new-arrivals-heading" style={{ fontSize: 'clamp(32px, 4vw, 54px)', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)', marginBottom: 18 }}>
                New Arrivals <span className="text-teal">— This Season.</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, fontWeight: 300, lineHeight: 1.8, marginBottom: 36 }}>
                Fresh timepieces just added to our collection. Premium quality, limited stock. Don&apos;t miss out.
              </p>
              <Link href={newestProduct ? `/product/${newestProduct._id}` : '/category/digital-mania'} className="btn-gold">Explore Now →</Link>
            </div>
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newestProduct ? (newestProduct.image.startsWith('http') ? newestProduct.image : newestProduct.image) : 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop'}
                alt={newestProduct ? `${newestProduct.name} - New Arrival` : 'New Premium Watch Arrival'}
                loading="lazy"
                style={{ width: 280, height: 280, objectFit: 'cover', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 24px 48px rgba(0,0,0,0.4)', display: 'block', marginBottom: 20 }}
              />
              <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Limited Stock</div>
            </div>
          </div>
        </section>
      </ScrollReveal>


      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="testimonials-heading">
          <div className="section-header" style={{ marginBottom: 56 }}>
            <div className="label-tag">Customer Stories</div>
            <h2 id="testimonials-heading" style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)', marginTop: 0 }}>
              What Our <span className="text-teal">Customers Say</span>
            </h2>
            <p>Real reviews from real buyers across India</p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <article key={i} className="testimonial-card-v2" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="testimonial-stars" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <span key={j} style={{ color: j < t.rating ? 'var(--gold)' : 'rgba(255,255,255,0.1)' }} aria-hidden="true">★</span>
                  ))}
                </div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" aria-hidden="true">{t.name.charAt(0)}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-location">{t.location}</div>
                  </div>
                  <span className="testimonial-badge">{t.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </ScrollReveal>


      {/* ═══════════════════════════════════════════════════════════
          WHY CHOOSE TIME LION
      ═══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="why-timelion-heading">
          <div className="section-header">
            <div className="label-tag">Our Promise</div>
            <h2 id="why-timelion-heading" style={{ marginTop: 14 }}>
              Why Choose <span className="text-teal">Time Lion</span>
            </h2>
            <p>Every watch we sell is a statement. Here&apos;s what sets us apart.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                title: 'Premium Quality',
                desc: 'Every timepiece is crafted with finest materials, ensuring comfort, durability, and elegance that lasts for years.',
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                title: 'Fast Delivery',
                desc: 'Lightning-fast shipping across India. Your watch arrives before the occasion — guaranteed.',
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2l2.4 7.6 8 2.4-8 2.4L12 22l-2.4-7.6-8-2.4 8-2.4z"/></svg>,
                title: 'Affordable Luxury',
                desc: 'Designer aesthetics at prices that make sense. Real premium quality, real value, real watches.',
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
                title: '1-Year Warranty',
                desc: 'Complete peace of mind with our comprehensive 1-year warranty on all watches. No questions asked.',
              },
            ].map((f) => (
              <div key={f.title} className="feature-card glass-panel" style={{ borderRadius: 16, position: 'relative' }}>
                <div className="feat-icon-wrap" style={{ color: 'var(--gold)', background: 'rgba(201, 168, 76, 0.08)', borderRadius: 12, display: 'inline-flex' }} aria-hidden="true">{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>


      {/* ═══════════════════════════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="faq-heading">
          <div className="section-header" style={{ marginBottom: 56 }}>
            <div className="label-tag">Got Questions?</div>
            <h2 id="faq-heading" style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)', marginTop: 14 }}>
              Frequently Asked <span className="text-teal">Questions</span>
            </h2>
            <p>Everything you need to know before you buy</p>
          </div>
          <FAQSection />
        </section>
      </ScrollReveal>


      {/* ═══════════════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section" style={{ paddingTop: 0 }} aria-label="Call to action">
          <div className="cta-banner">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="label-tag" style={{ marginBottom: 24 }}>🎁 Exclusive Offer</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontFamily: 'var(--font-head)', letterSpacing: '-0.02em', marginBottom: 16 }}>
                Can&apos;t Find What You Need?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.8, maxWidth: 520, margin: '0 auto 36px' }}>
                Chat directly with our team on WhatsApp for personalized watch recommendations, bulk orders, and exclusive deals not listed on the website.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/917418719580?text=Hi%20Time%20Lion%2C%20I%20need%20help%20finding%20a%20watch!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.35)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us Now
                </a>
                <Link href="/contact" className="btn-outline">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}
