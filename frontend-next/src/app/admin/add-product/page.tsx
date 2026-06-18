'use client';

import React, { useState, useEffect } from 'react';
import ImageCropModal from '@/components/admin/ImageCropModal';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const LabeledField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <label style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: 'var(--muted)'
    }}>
      {label}
    </label>
    {children}
  </div>
);

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [imgPreview, setImgPreview] = useState('');
  const [badgeType, setBadgeType] = useState('');
  const [imgStatus, setImgStatus] = useState<React.ReactNode>('');
  const [imageUrl, setImageUrl] = useState('');
  const [cropFile, setCropFile] = useState<File | null>(null);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [comboP1, setComboP1] = useState('');
  const [comboP2, setComboP2] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState<number | ''>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(productsList);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category === 'special-combo' && comboP1 && comboP2) {
      const p1 = allProducts.find(p => p.id === comboP1);
      const p2 = allProducts.find(p => p.id === comboP2);
      if (p1 && p2) {
        setSuggestedPrice((p1.price || 0) + (p2.price || 0));
      }
    } else {
      setSuggestedPrice('');
    }
  }, [comboP1, comboP2, category, allProducts]);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Image too large (max 10MB).', type: 'error' } }));
      e.target.value = '';
      return;
    }
    setCropFile(file);
    e.target.value = '';
  };

  const handleCropComplete = (url: string) => {
    setCropFile(null);
    setImageUrl(url);
    setImgPreview(url);
    setImgStatus(<span style={{ color: 'var(--success)' }}>✓ Image cropped & uploaded to cloud</span>);
  };

  const submitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('pName') as HTMLInputElement).value.trim();
    const currentPrice = Number((form.elements.namedItem('pPrice') as HTMLInputElement).value);

    if (!name || !category || !currentPrice) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Please fill all required fields.', type: 'error' } }));
      return;
    }

    // Duplicate Name Check
    const nameExists = allProducts.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (nameExists) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'A product with this name already exists.', type: 'error' } }));
      return;
    }

    let finalImageUrl = imageUrl;
    
    if (category === 'special-combo') {
      if (!comboP1 || !comboP2) {
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Please select 2 products for the combo.', type: 'error' } }));
        return;
      }
      if (comboP1 === comboP2) {
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Please select two different products.', type: 'error' } }));
        return;
      }
      if (!finalImageUrl) {
        // Fallback to first product image if not uploaded
        const p1 = allProducts.find(p => p.id === comboP1);
        if (p1 && p1.image) {
          finalImageUrl = p1.image;
        } else {
          window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Please upload an image for the combo.', type: 'error' } }));
          return;
        }
      }
    } else {
      if (!finalImageUrl) {
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Please upload and crop a product image first.', type: 'error' } }));
        return;
      }
    }

    setLoading(true);

    const payload: any = {
      name, category, price: currentPrice,
      originalPrice: (form.elements.namedItem('pOriginal') as HTMLInputElement).value
        ? Number((form.elements.namedItem('pOriginal') as HTMLInputElement).value) : null,
      stock: (form.elements.namedItem('pStock') as HTMLInputElement).value
        ? Number((form.elements.namedItem('pStock') as HTMLInputElement).value) : 10,
      rating: 0,
      badge: badgeType === 'Others' 
        ? ((form.elements.namedItem('pBadgeCustom') as HTMLInputElement)?.value.trim() || '')
        : badgeType,
      description: (form.elements.namedItem('pDesc') as HTMLInputElement).value.trim(),
      image: finalImageUrl,
      createdAt: new Date().toISOString(),
    };

    if (category === 'special-combo') {
       payload.comboProductIds = [comboP1, comboP2];
    }

    try {
      await addDoc(collection(db, 'products'), payload);
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: `"${name}" added to store!`, type: 'success' } }));
      
      // Update local state without refetching immediately
      setAllProducts([...allProducts, { id: Math.random().toString(), ...payload }]);
      
      form.reset();
      setImgPreview(''); setImageUrl(''); setImgStatus(''); setBadgeType('');
      setCategory(''); setComboP1(''); setComboP2(''); setSuggestedPrice('');
    } catch (err: any) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Error: ' + err.message, type: 'error' } }));
    }
    setLoading(false);
  };

  const card = {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '28px 32px',
    marginBottom: 20,
  };

  return (
    <div className="fade-up">
      {cropFile && (
        <ImageCropModal
          file={cropFile}
          onComplete={handleCropComplete}
          onCancel={() => setCropFile(null)}
        />
      )}

      <div className="pg-title">Add Product</div>
      <div className="pg-sub">Fill the form below and upload a photo</div>

      <form onSubmit={submitProduct} autoComplete="off" style={{ maxWidth: 820 }}>
        
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
            Basic Info
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <LabeledField label="Product Name *">
              <input name="pName" placeholder="e.g. Gold Elite Pro" required className="admin-input" />
            </LabeledField>
            <LabeledField label="Category *">
              <select 
                name="pCategory" 
                required 
                className="admin-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">— Select category —</option>
                <option value="classic-metal">Classic Metal</option>
                <option value="digital-mania">Digital Mania</option>
                <option value="special-combo">Special Combo</option>
                <option value="funky">Funky</option>
              </select>
            </LabeledField>
          </div>

          {category === 'special-combo' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18, padding: 16, background: 'rgba(25,211,197,0.05)', borderRadius: 12, border: '1px solid rgba(25,211,197,0.1)' }}>
              <LabeledField label="Select Product 1 *">
                <select className="admin-input" value={comboP1} onChange={e => setComboP1(e.target.value)} required>
                  <option value="">— First Combo Item —</option>
                  {allProducts.filter(p => p.category !== 'special-combo').map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                  ))}
                </select>
              </LabeledField>
              <LabeledField label="Select Product 2 *">
                <select className="admin-input" value={comboP2} onChange={e => setComboP2(e.target.value)} required>
                  <option value="">— Second Combo Item —</option>
                  {allProducts.filter(p => p.category !== 'special-combo' && p.id !== comboP1).map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                  ))}
                </select>
              </LabeledField>
              <div style={{ gridColumn: '1 / -1', fontSize: 12, color: 'var(--muted)' }}>
                {comboP1 && comboP2 && suggestedPrice ? `Calculated Combo Price: ₹${suggestedPrice} (You can edit the Sale Price below to offer a discount!)` : 'Select two products to calculate combined price.'}
              </div>
            </div>
          )}
        </div>

        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
            Pricing & Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
            <LabeledField label="Sale Price ₹ *">
              <input 
                type="number" 
                name="pPrice" 
                placeholder="1999" 
                min="1" 
                required 
                className="admin-input" 
                defaultValue={suggestedPrice !== '' ? suggestedPrice : ''}
                key={suggestedPrice} 
              />
            </LabeledField>
            <LabeledField label="Original Price ₹">
              <input type="number" name="pOriginal" placeholder="2999" min="0" className="admin-input" />
            </LabeledField>
            <LabeledField label="Stock">
              <input type="number" name="pStock" placeholder="20" min="0" defaultValue="10" className="admin-input" />
            </LabeledField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: badgeType === 'Others' ? '1fr 1fr 1fr' : '1fr 1fr', gap: 16 }}>
            <LabeledField label="Badge (optional)">
              <select 
                name="pBadge" 
                className="admin-input"
                value={badgeType}
                onChange={(e) => setBadgeType(e.target.value)}
              >
                <option value="">— No Badge —</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="NEW">NEW</option>
                <option value="LIMITED">LIMITED</option>
                <option value="Others">Others</option>
              </select>
            </LabeledField>
            {badgeType === 'Others' && (
              <LabeledField label="Custom Badge">
                <input name="pBadgeCustom" placeholder="Type custom badge..." className="admin-input" />
              </LabeledField>
            )}
            <LabeledField label="Short Description">
              <input name="pDesc" placeholder="A brief description…" className="admin-input" />
            </LabeledField>
          </div>
        </div>

        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
            Product Image {category === 'special-combo' && <span style={{ color: 'var(--teal)', fontSize: 10, marginLeft: 8 }}>(Optional for Combos)</span>}
          </div>

          <div style={{
            border: '2px dashed rgba(25,211,197,0.2)',
            borderRadius: 12, padding: 32, textAlign: 'center',
            cursor: 'pointer', position: 'relative', transition: '0.2s ease',
            background: 'rgba(25,211,197,0.02)',
          }}>
            <input
              type="file" id="imgFile"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImagePick}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
            />
            {imgPreview ? (
              <img src={imgPreview} alt="Preview" style={{
                width: 100, height: 100, objectFit: 'cover',
                borderRadius: 10, border: '1px solid rgba(25,211,197,0.3)',
                margin: '0 auto',
              }} />
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 600 }}>Click to upload</span> a photo
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 4 }}>JPG, PNG, WEBP — max 10 MB</div>
                {category === 'special-combo' && (
                  <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 8 }}>
                    If no image is uploaded, we will automatically use the first product's image.
                  </div>
                )}
              </>
            )}
          </div>

          {imgStatus && (
            <div style={{ fontSize: 12, marginTop: 10 }}>{imgStatus}</div>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              Adding…
            </>
          ) : 'Add Product →'}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </form>
    </div>
  );
}
