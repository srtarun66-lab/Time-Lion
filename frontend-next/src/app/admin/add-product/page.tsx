'use client';

import React, { useState } from 'react';
import ImageCropModal from '@/components/admin/ImageCropModal';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

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
  const [cropFile, setCropFile] = useState<File | null>(null); // triggers crop modal

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Image too large (max 10MB).', type: 'error' } }));
      e.target.value = '';
      return;
    }
    setCropFile(file); // open crop modal
    e.target.value = '';
  };

  const handleCropComplete = (url: string) => {
    setCropFile(null);
    setImageUrl(url);
    setImgPreview(url);
    setImgStatus(<span style={{ color: 'var(--success)' }}>✓ Image cropped &amp; uploaded to cloud</span>);
  };



  const submitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('pName') as HTMLInputElement).value.trim();
    const category = (form.elements.namedItem('pCategory') as HTMLSelectElement).value;
    const price = Number((form.elements.namedItem('pPrice') as HTMLInputElement).value);

    if (!name || !category || !price) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Please fill all required fields.', type: 'error' } }));
      return;
    }
    if (!imageUrl) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Please upload and crop a product image first.', type: 'error' } }));
      return;
    }
    setLoading(true);

    const payload = {
      name, category, price,
      originalPrice: (form.elements.namedItem('pOriginal') as HTMLInputElement).value
        ? Number((form.elements.namedItem('pOriginal') as HTMLInputElement).value) : undefined,
      stock: (form.elements.namedItem('pStock') as HTMLInputElement).value
        ? Number((form.elements.namedItem('pStock') as HTMLInputElement).value) : 10,
      rating: 0,
      badge: badgeType === 'Others' 
        ? ((form.elements.namedItem('pBadgeCustom') as HTMLInputElement)?.value.trim() || '')
        : badgeType,
      description: (form.elements.namedItem('pDesc') as HTMLInputElement).value.trim(),
      image: imageUrl,
    };

    try {
      payload.createdAt = new Date().toISOString();
      await addDoc(collection(db, 'products'), payload);
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: `"${name}" added to store!`, type: 'success' } }));
      form.reset();
      setImgPreview(''); setImageUrl(''); setImgStatus(''); setBadgeType('');
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Cannot reach server.', type: 'error' } }));
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
      {/* Crop Modal */}
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

        {/* Basic Info */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
            Basic Info
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <LabeledField label="Product Name *">
              <input name="pName" placeholder="e.g. Gold Elite Pro" required className="admin-input" />
            </LabeledField>
            <LabeledField label="Category *">
              <select name="pCategory" required className="admin-input">
                <option value="">— Select category —</option>
                <option value="classic-metal">Classic Metal</option>
                <option value="digital-mania">Digital Mania</option>
                <option value="special-combo">Special Combo</option>
                <option value="funky">Funky</option>
              </select>
            </LabeledField>
          </div>
        </div>

        {/* Pricing & Details */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
            Pricing & Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
            <LabeledField label="Sale Price ₹ *">
              <input type="number" name="pPrice" placeholder="1999" min="1" required className="admin-input" />
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

        {/* Image */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
            Product Image
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
