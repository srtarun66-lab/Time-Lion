import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/CartContext';
import Link from 'next/link';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const categoryMeta: Record<string, { title: string; description: string; h1: string; subtitle: string; emoji: string }> = {
  'classic-metal': {
    title: 'Classic Metal Watches – Steel & Titanium Timepieces | Time Lion',
    description:
      'Shop premium Classic Metal watches at Time Lion. Steel, bronze & titanium timepieces for every occasion. 1-Year Warranty, Free Shipping above ₹999.',
    h1: 'Classic Metal',
    subtitle: 'Steel, bronze & titanium — crafted for eternity.',
    emoji: '',
  },
  'digital-mania': {
    title: 'Digital Watches Online India – Bold & Smart Timepieces | Time Lion',
    description:
      'Shop Digital Mania watches at Time Lion. Smart displays, bold designs, and modern features for the tech-savvy. Free Shipping above ₹999, 1-Year Warranty.',
    h1: 'Digital Mania',
    subtitle: 'Smart features, bold displays, built for the modern age.',
    emoji: '',
  },
  'special-combo': {
    title: 'Watch Combo Offers – Best Value Bundle Deals | Time Lion',
    description:
      'Explore Special Combo watch offers at Time Lion. Curated watch pairs at unbeatable prices — save up to ₹1700. Free shipping & easy returns.',
    h1: 'Special Combo',
    subtitle: 'Curated pairs at unbeatable value. Save up to ₹1700.',
    emoji: '',
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = categoryMeta[slug];
  if (!meta) return { title: 'Watch Collection – Time Lion' };
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://www.timelion.in/category/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://www.timelion.in/category/${slug}`,
    },
  };
}

async function getCategoryProducts(slug: string): Promise<Product[]> {
  try {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    if (slug) {
      q = query(collection(db, 'products'), where('category', '==', slug), orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })) as unknown as Product[];
  } catch (error) {
    console.error('Error fetching category products from Firebase:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const products = await getCategoryProducts(slug);

  const headerInfo = categoryMeta[slug] || {
    emoji: '',
    h1: 'All Products',
    subtitle: 'Explore our premium collection.',
    title: '',
    description: '',
  };

  const otherCategories = Object.entries(categoryMeta).filter(([key]) => key !== slug);

  return (
    <div className="page-content">

      {/* Page Title */}
      <div className="page-hero" style={{ paddingBottom: 48 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">{headerInfo.emoji}</div>
        <h1 className="fade-up" style={{ fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.02em', marginBottom: 12 }}>
          {headerInfo.h1}
        </h1>
        <p style={{ fontSize: 16, maxWidth: 480, margin: '0 auto' }}>{headerInfo.subtitle}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
            padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(201,168,76,0.2)',
            color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <section
        style={{ padding: '0 48px 80px', maxWidth: 1400, margin: '0 auto' }}
        aria-label={`${headerInfo.h1} watches`}
      >
        {products.length > 0 ? (
          <div className={slug === 'special-combo' ? 'combo-grid' : 'product-grid-3'}>
            {products.map((p) => (
              <ProductCard key={p._id} product={p} isCombo={slug === 'special-combo'} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            background: 'var(--bg2)', borderRadius: 20, border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true"></div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 24, marginBottom: 12 }}>New Stock Coming Soon</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
              We&apos;re adding new {headerInfo.h1} watches to this collection. Check back soon!
            </p>
            <Link href="/" className="btn-primary">Back to Home</Link>
          </div>
        )}
      </section>

      {/* Other Categories */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
          Explore Other Collections
        </h2>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {otherCategories.map(([key, info]) => (
            <Link
              key={key}
              href={`/category/${key}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '12px 24px', borderRadius: 50,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--text-sub)', fontSize: 14, fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.25s',
              }}
            >
              {info.emoji} {info.h1}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
