import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import { Product } from '@/context/CartContext';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, getCountFromServer } from 'firebase/firestore';

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

export default async function Home() {
  const [allProducts, siteStats] = await Promise.all([getAllProducts(), getSiteStats()]);
  const featuredProducts = allProducts.slice(0, 3);
  const newestProduct = allProducts.length > 0 ? allProducts[allProducts.length - 1] : null;

  // Compute real stats from live data
  const totalModels = allProducts.length;
  const totalOrders = siteStats.totalOrders;
  
  const ratedProducts = allProducts.filter((p: any) => p.rating > 0);
  const avgRating = ratedProducts.length > 0
    ? (ratedProducts.reduce((sum: number, p: any) => sum + p.rating, 0) / ratedProducts.length).toFixed(1)
    : '—';

  // Format customer count nicely
  const customerDisplay = totalOrders >= 1000
    ? `${(totalOrders / 1000).toFixed(1).replace(/\.0$/, '')}K`
    : totalOrders > 0 ? `${totalOrders}` : '0';

  const categories = [
    { href: '/category/classic-metal', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>, name: 'Classic Metal', count: allProducts.filter(p => p.category === 'classic-metal').length, desc: 'Timeless steel & titanium' },
    { href: '/category/digital-mania', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="5" width="12" height="14" rx="2" ry="2"/><line x1="16" y1="21" x2="8" y2="21"/><line x1="16" y1="3" x2="8" y2="3"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="10" y1="12" x2="10" y2="12.01"/><line x1="14" y1="12" x2="14" y2="12.01"/></svg>, name: 'Digital Mania', count: allProducts.filter(p => p.category === 'digital-mania').length, desc: 'Smart displays & bold looks' },
    { href: '/category/special-combo', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>, name: 'Special Combo', count: allProducts.filter(p => p.category === 'special-combo').length, desc: 'Best value bundles' },
  ];

  const testimonials = [
    { name: 'Arjun K.', location: 'Chennai', rating: 5, text: 'Absolutely stunning watch. The quality exceeded my expectations. Perfect for formal occasions!', emoji: 'A' },
    { name: 'Priya M.', location: 'Bangalore', rating: 5, text: 'Ordered the combo set — great value. Fast delivery and beautiful packaging. Will order again!', emoji: 'P' },
    { name: 'Ravi S.', location: 'Mumbai', rating: 5, text: 'The Digital Mania collection is fire. My friends keep asking where I got it from. 10/10.', emoji: 'R' },
  ];

  return (
    <div className="page-content">

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="hero-section">

        {/* Particle / Grid Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          {/* Animated gradient blobs */}
          <div style={{
            position: 'absolute', top: '10%', right: '5%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)',
            filter: 'blur(40px)',
            animation: 'glowPulse 8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '5%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)',
            filter: 'blur(60px)',
            animation: 'glowPulse 10s ease-in-out infinite 2s',
          }} />
          {/* Fine grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.4,
          }} />

        </div>

        <div className="hero-container">

          {/* ─── LEFT: Text Content ─── */}
          <div className="hero-left slide-left" style={{ animationDelay: '0.1s' }}>



            {/* Hero Headline */}
            <h1 style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(44px, 5.5vw, 80px)',
              fontWeight: 900,
              lineHeight: 1.25,
              letterSpacing: '-0.03em',
              marginBottom: 16,
            }}>
              <span className="reveal-text"><span style={{ animationDelay: '0.15s' }}>Crafted For</span></span>
              <span className="reveal-text"><span className="text-teal" style={{ animationDelay: '0.25s' }}>Every Second.</span></span>
            </h1>
            <h2 className="fade-up" style={{
              fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 400, color: 'var(--gold)', letterSpacing: '0.02em',
              lineHeight: 1.4, paddingBottom: '4px',
              marginBottom: 20, animationDelay: '0.35s'
            }}>
              Luxury Meets Precision.
            </h2>

            {/* Subtitle */}
            <p className="fade-up" style={{
              fontSize: 16, color: 'var(--text-sub)',
              lineHeight: 1.8, maxWidth: 480,
              fontWeight: 300, marginBottom: 32,
              animationDelay: '0.45s',
            }}>
              Discover premium analog and digital watches designed for style, performance, and elegance — crafted for those who know the value of every second.
            </p>

            {/* CTA Buttons */}
            <div className="fade-up hero-btns" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animationDelay: '0.55s' }}>
              <Link href="/category/classic-metal" className="btn-primary" style={{ fontSize: 14 }}>
                Shop Collection
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link href="/category/special-combo" className="btn-outline" style={{ fontSize: 14 }}>
                Explore Combos
              </Link>
            </div>

            {/* Stats Row */}
            <div className="fade-up hero-stats" style={{
              display: 'flex', gap: 36, marginTop: 32,
              animationDelay: '0.65s',
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

          {/* ─── RIGHT: Watch Showcase ─── */}
          <div className="hero-right slide-right" style={{ animationDelay: '0.2s' }}>

            {/* Outer glow ring */}
            <div style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Glow rings */}
              <div style={{
                position: 'absolute', inset: -40,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 65%)',
                animation: 'glowPulse 4s ease-in-out infinite',
              }} />
               {/* Watch Image */}
              <div style={{ 
                position: 'relative', 
                zIndex: 1,
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
                mixBlendMode: 'screen'
              }}>
                <Image 
                  src="/hero.jpeg" 
                  alt="Time-Lion Watch" 
                  width={460} 
                  height={520} 
                  style={{ 
                    objectFit: 'cover', 
                    borderRadius: 16
                  }} 
                  priority
                />
                {/* Ground shadow glow */}
                <div style={{
                  width: 160, height: 28, marginTop: -10, marginLeft: 60,
                  background: 'radial-gradient(ellipse, var(--teal) 0%, transparent 70%)',
                  filter: 'blur(18px)', opacity: 0.12,
                }} />
              </div>
            </div>


          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          SHOP BY STYLE
      ═══════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section">
        <div className="section-title-row">
          <div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)' }}>Shop By Style</h2>
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
              <div className="cat-icon-wrap" style={{ color: 'var(--gold)', marginBottom: 16, padding: 12, background: 'rgba(201, 168, 76, 0.08)', borderRadius: 12, display: 'inline-flex' }}>{cat.icon}</div>
              <div className="cat-name" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{cat.name}</div>
              <div className="cat-desc" style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 300, marginBottom: 16 }}>{cat.desc}</div>
              <div className="cat-count" style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>{cat.count} Items →</div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--teal), transparent)', opacity: 0 }} className="hover-line" />
            </Link>
          ))}
        </div>
        </section>
      </ScrollReveal>



      {/* ═══════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-header" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)' }}>
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
        </section>
      </ScrollReveal>

      {/* ═══════════════════════════════════════════════════════
          NEW ARRIVALS BANNER
      ═══════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="arrival-section" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="arrival-banner-inner" style={{
          borderRadius: 28,
          background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
          border: '1px solid var(--border)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 40,
        }}>
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
            width: 360, height: 360, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 560 }}>

            <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)', marginBottom: 18 }}>
              New Arrivals <span className="text-teal">— This Season.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, fontWeight: 300, lineHeight: 1.8, marginBottom: 36 }}>
              Fresh timepieces just added to our collection. Premium quality, limited stock. Don&apos;t miss out.
            </p>
            <Link href={newestProduct ? `/product/${newestProduct._id}` : "/category/digital-mania"} className="btn-gold">Explore Now →</Link>
          </div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={newestProduct ? (newestProduct.image.startsWith('http') ? newestProduct.image : newestProduct.image) : "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop"} 
              alt={newestProduct ? newestProduct.name : "Premium Watch"} 
              style={{ width: 280, height: 280, objectFit: 'cover', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 24px 48px rgba(0,0,0,0.4)', display: 'block', marginBottom: 20 }}
            />
            <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Limited Stock</div>
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* ═══════════════════════════════════════════════════════
          WHY CHOOSE TIME LION
      ═══════════════════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div className="label-tag">Our Promise</div>
          <h2 style={{ marginTop: 14 }}>
            Why Choose <span className="text-teal">Time Lion</span>
          </h2>
          <p>Every watch we sell is a statement. Here&apos;s what sets us apart.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: 'Premium Quality', desc: 'Every timepiece is crafted with finest materials, ensuring comfort, durability, and elegance that lasts for years.' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: 'Fast Delivery', desc: 'Lightning-fast shipping across India. Your watch arrives before the occasion — guaranteed.' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.6 8 2.4-8 2.4L12 22l-2.4-7.6-8-2.4 8-2.4z"/></svg>, title: 'Affordable Luxury', desc: 'Designer aesthetics at prices that make sense. Real premium quality, real value, real watches.' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, title: 'Assured Warranty', desc: 'Complete peace of mind with our comprehensive 1-year warranty on all watches.' },
          ].map((f) => (
            <div key={f.title} className="feature-card glass-panel" style={{ 
              borderRadius: 16, 
              position: 'relative'
            }}>
              <div className="feat-icon-wrap" style={{ color: 'var(--gold)', background: 'rgba(201, 168, 76, 0.08)', borderRadius: 12, display: 'inline-flex' }}>{f.icon}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{f.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        </section>
      </ScrollReveal>




    </div>
  );
}

