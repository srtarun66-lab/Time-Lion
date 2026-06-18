'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, Product } from '@/context/CartContext';

export default function ProductCard({ product, isCombo = false }: { product: Product, isCombo?: boolean }) {
  const router = useRouter();
  const { addToCart, setCheckoutProduct, toggleWishlist, isInWishlist } = useCart();
  const liked = isInWishlist(product._id);
  const [animatingHeart, setAnimatingHeart] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!liked) {
      setAnimatingHeart(true);
      setTimeout(() => setAnimatingHeart(false), 400);
    }
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 800);
  };

  const disc = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const rating = product.rating || 4.5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  const badgeClass = disc > 20 ? 'badge-sale' : product.badge ? 'badge-new' : '';

  return (
    <div className="product-card" onClick={() => router.push(`/product/${product._id}`)}>

      {/* ── Badges ── */}
      {product.badge && (
        <div className={`product-badge badge-new`}>{product.badge}</div>
      )}
      {disc > 0 && (
        <div className="product-badge badge-sale" style={{ left: 'auto', right: 12 }}>
          -{disc}%
        </div>
      )}

      {/* ── Image ── */}
      <div className="product-img">
        <img
          src={product.image.startsWith('http') ? product.image : product.image}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.6s ease',
            aspectRatio: isCombo ? '16/9' : '4/5'
          }}
        />
        {/* Image overlay gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(transparent, rgba(6,10,18,0.75))',
          zIndex: 1,
        }} />
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistClick}
          style={{
            position: 'absolute', bottom: 16, right: 16, zIndex: 2,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease',
            color: liked ? '#f43f5e' : '#fff'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg className={animatingHeart ? 'heart-anim' : ''} width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#f43f5e' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="product-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          {/* Name */}
          <div className="product-name" style={{ marginBottom: 0 }}>{product.name}</div>

          {/* Stars */}
          <div 
            className="star-row" 
            style={{ marginBottom: 0, cursor: 'pointer', flexShrink: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product._id}#reviews`);
            }}
            title="View Reviews"
          >
            <span className="stars" style={{ fontSize: 11 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{
                  color: i < fullStars ? 'var(--gold)'
                    : (i === fullStars && halfStar ? 'var(--gold)' : 'var(--border)'),
                }}>★</span>
              ))}
            </span>
            <span className="star-count" style={{ fontSize: 11 }}>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6, fontWeight: 300, flex: 1 }}>
            {product.description}
          </div>
        )}

        {/* Price */}
        <div className="product-price" style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {isCombo && product.originalPrice ? (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 16px', marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sub)', marginBottom: 8 }}>
                <span>Individual Price</span>
                <span>₹{(product.originalPrice / 2).toLocaleString('en-IN')} each</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: 8 }}>
                <span>Combined Price</span>
                <span>₹{product.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: 8, marginTop: 4 }}>
                <span style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 600 }}>Combo Offer</span>
                <span className="price-main" style={{ fontSize: 20 }}>₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div className="price-main">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              {product.originalPrice && (
                <div className="price-orig">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            className={`btn-cart ${cartAdded ? 'cart-added-anim' : ''}`}
            onClick={handleAddToCart}
            style={{ flex: 1 }}
          >
            {cartAdded ? '✓ Added' : '+ Add to Cart'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setCheckoutProduct(product); router.push('/checkout'); }}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dim))',
              color: '#0a0803', border: 'none',
              padding: '12px 10px', borderRadius: 10,
              fontFamily: 'var(--font-head)',
              fontWeight: 600, fontSize: 13,
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: '0 4px 16px rgba(201,168,76,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,0.2)';
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

