const fs = require('fs');
const path = require('path');

const srcEdit = path.join('d:', 'Work', 'Projects', 'niraz-output', 'admin-next', 'src', 'app', 'edit-product', '[id]', 'page.tsx');
let editContent = fs.readFileSync(srcEdit, 'utf8');

// We need to convert it into a Modal component
let modalContent = `import React, { useState, useEffect } from 'react';
import ImageCropModal from '@/components/ImageCropModal';

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

export default function EditProductModal({ product, onClose, onSave }: { product: any, onClose: () => void, onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  const [imgPreview, setImgPreview] = useState(product.image?.startsWith('http') ? product.image : 'http://127.0.0.1:5000' + product.image);
  const [badgeType, setBadgeType] = useState(['BESTSELLER', 'NEW', 'LIMITED', ''].includes(product.badge || '') ? (product.badge || '') : 'Others');
  const [imgStatus, setImgStatus] = useState<React.ReactNode>('');
  const [imageUrl, setImageUrl] = useState(product.image);
  const [cropFile, setCropFile] = useState<File | null>(null);

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
      originalPrice: (form.elements.namedItem('pOriginal') as HTMLInputElement).value ? Number((form.elements.namedItem('pOriginal') as HTMLInputElement).value) : undefined,
      stock: (form.elements.namedItem('pStock') as HTMLInputElement).value ? Number((form.elements.namedItem('pStock') as HTMLInputElement).value) : 10,
      rating: product.rating || 0,
      badge: badgeType === 'Others' ? ((form.elements.namedItem('pBadgeCustom') as HTMLInputElement)?.value.trim() || '') : badgeType,
      description: (form.elements.namedItem('pDesc') as HTMLInputElement).value.trim(),
      image: imageUrl,
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/api/products/' + product._id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: "Product updated successfully!", type: 'success' } }));
        onSave();
      } else {
        window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: data.message || 'Error updating product.', type: 'error' } }));
      }
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Cannot reach server.', type: 'error' } }));
    }
    setLoading(false);
  };

  const card = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 32px', marginBottom: 20 };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 40, width: '90%', maxWidth: 860, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text)', fontSize: 24, cursor: 'pointer' }}>×</button>
        
        {cropFile && <ImageCropModal file={cropFile} onComplete={handleCropComplete} onCancel={() => setCropFile(null)} />}

        <div className="pg-title" style={{ marginBottom: 20 }}>Edit Product</div>

        <form onSubmit={submitProduct} autoComplete="off">
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>Basic Info</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <LabeledField label="Product Name *"><input name="pName" defaultValue={product.name} placeholder="e.g. Gold Elite Pro" required className="admin-input" /></LabeledField>
              <LabeledField label="Category *">
                <select name="pCategory" defaultValue={product.category} required className="admin-input">
                  <option value="">— Select category —</option>
                  <option value="classic-metal">Classic Metal</option>
                  <option value="digital-mania">Digital Mania</option>
                  <option value="special-combo">Special Combo</option>
                  <option value="funky">Funky</option>
                </select>
              </LabeledField>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>Pricing & Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <LabeledField label="Sale Price ₹ *"><input type="number" name="pPrice" defaultValue={product.price} placeholder="1999" min="1" required className="admin-input" /></LabeledField>
              <LabeledField label="Original Price ₹"><input type="number" name="pOriginal" defaultValue={product.originalPrice} placeholder="2999" min="0" className="admin-input" /></LabeledField>
              <LabeledField label="Stock"><input type="number" name="pStock" placeholder="20" min="0" defaultValue={product.stock} className="admin-input" /></LabeledField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: badgeType === 'Others' ? '1fr 1fr 1fr' : '1fr 1fr', gap: 16 }}>
              <LabeledField label="Badge (optional)">
                <select name="pBadge" className="admin-input" value={badgeType} onChange={(e) => setBadgeType(e.target.value)}>
                  <option value="">— No Badge —</option>
                  <option value="BESTSELLER">BESTSELLER</option>
                  <option value="NEW">NEW</option>
                  <option value="LIMITED">LIMITED</option>
                  <option value="Others">Others</option>
                </select>
              </LabeledField>
              {badgeType === 'Others' && <LabeledField label="Custom Badge"><input name="pBadgeCustom" defaultValue={badgeType === 'Others' ? product.badge : ''} placeholder="Type custom badge..." className="admin-input" /></LabeledField>}
              <LabeledField label="Short Description"><input name="pDesc" defaultValue={product.description} placeholder="A brief description…" className="admin-input" /></LabeledField>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>Product Image</div>
            <div style={{ border: '2px dashed rgba(25,211,197,0.2)', borderRadius: 12, padding: 32, textAlign: 'center', cursor: 'pointer', position: 'relative', background: 'rgba(25,211,197,0.02)' }}>
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={handleImagePick} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
              {imgPreview ? (
                <img src={imgPreview} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(25,211,197,0.3)', margin: '0 auto' }} />
              ) : (
                <div style={{ color: 'var(--muted)', fontSize: 13 }}><span style={{ color: 'var(--teal)', fontWeight: 600 }}>Click to upload</span> a photo</div>
              )}
            </div>
            {imgStatus && <div style={{ fontSize: 12, marginTop: 10 }}>{imgStatus}</div>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>{loading ? 'Saving…' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join('d:', 'Work', 'Projects', 'niraz-output', 'admin-next', 'src', 'components', 'EditProductModal.tsx'), modalContent);
console.log('Done creating EditProductModal.tsx');
