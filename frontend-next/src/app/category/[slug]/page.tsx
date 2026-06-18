import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/CartContext';
import Link from 'next/link';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

async function getCategoryProducts(slug: string): Promise<Product[]> {
  try {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    if (slug) {
      q = query(collection(db, 'products'), where('category', '==', slug), orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
  } catch (error) {
    console.error('Error fetching category products from Firebase:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const products = await getCategoryProducts(slug);

  const titles: Record<string, { title: string; subtitle: string; emoji: string }> = {
    'classic-metal': { emoji: '🏅', title: 'Classic Metal', subtitle: 'Steel, bronze & titanium — crafted for eternity.' },
    'digital-mania': { emoji: '⚡', title: 'Digital Mania', subtitle: 'Smart features, bold displays, built for the modern age.' },
    'special-combo': { emoji: '🎯', title: 'Special Combo', subtitle: 'Curated pairs at unbeatable value. Save up to ₹1700.' },
  };

  const headerInfo = titles[slug] || { emoji: '⌚', title: 'All Products', subtitle: 'Explore our premium collection.' };

  return (
    <div className="page-content">

      {/* Page Title */}
      <div style={{ padding: '24px 48px 32px', textAlign: 'center' }}>
        <h1 className="fade-up" style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', margin: 0 }}>
          {headerInfo.title}
        </h1>
      </div>

      {/* Products Grid */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div className="product-grid-3">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>


    </div>
  );
}
