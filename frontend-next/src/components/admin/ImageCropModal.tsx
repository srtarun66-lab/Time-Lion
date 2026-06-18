'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface CropBox { x: number; y: number; size: number; }

interface Props {
  file: File;
  onComplete: (url: string) => void;
  onCancel: () => void;
}

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY!;

export default function ImageCropModal({ file, onComplete, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [displayW, setDisplayW] = useState(0);
  const [displayH, setDisplayH] = useState(0);
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, size: 0 });
  const [dragging, setDragging] = useState<null | 'move' | 'resize'>(null);
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, cx: 0, cy: 0, cs: 0 });
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');

  // Load image into canvas
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);

      // Fit into 520px max display
      const MAX = 520;
      const scale = Math.min(MAX / img.naturalWidth, MAX / img.naturalHeight, 1);
      const dw = Math.round(img.naturalWidth * scale);
      const dh = Math.round(img.naturalHeight * scale);
      setDisplayW(dw);
      setDisplayH(dh);

      // Initial crop: largest centered square
      const initSize = Math.min(dw, dh);
      setCrop({ x: Math.round((dw - initSize) / 2), y: Math.round((dh - initSize) / 2), size: initSize });
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !displayW || !displayH) return;

    canvas.width = displayW;
    canvas.height = displayH;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(img, 0, 0, displayW, displayH);

    // Dim outside
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, displayW, displayH);

    // Clear crop area
    ctx.clearRect(crop.x, crop.y, crop.size, crop.size);
    ctx.drawImage(img, 0, 0, displayW, displayH);
    ctx.clearRect(crop.x, crop.y, crop.size, crop.size);
    // Redraw just the crop portion
    const sx = (crop.x / displayW) * img.naturalWidth;
    const sy = (crop.y / displayH) * img.naturalHeight;
    const sw = (crop.size / displayW) * img.naturalWidth;
    const sh = (crop.size / displayH) * img.naturalHeight;
    ctx.drawImage(img, sx, sy, sw, sh, crop.x, crop.y, crop.size, crop.size);

    // Border
    ctx.strokeStyle = 'rgba(25,211,197,0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.size, crop.size);

    // Grid lines
    ctx.strokeStyle = 'rgba(25,211,197,0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      const x = crop.x + (crop.size / 3) * i;
      const y = crop.y + (crop.size / 3) * i;
      ctx.beginPath(); ctx.moveTo(x, crop.y); ctx.lineTo(x, crop.y + crop.size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(crop.x, y); ctx.lineTo(crop.x + crop.size, y); ctx.stroke();
    }

    // Corner handles
    const H = 10;
    const corners = [
      [crop.x, crop.y], [crop.x + crop.size - H, crop.y],
      [crop.x, crop.y + crop.size - H], [crop.x + crop.size - H, crop.y + crop.size - H]
    ];
    ctx.fillStyle = 'var(--teal, #19D3C5)';
    corners.forEach(([cx, cy]) => ctx.fillRect(cx, cy, H, H));

    // Resize handle (bottom-right)
    ctx.fillStyle = '#19D3C5';
    ctx.beginPath();
    ctx.arc(crop.x + crop.size, crop.y + crop.size, 8, 0, Math.PI * 2);
    ctx.fill();
  }, [crop, displayW, displayH]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { mx: clientX - rect.left, my: clientY - rect.top };
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const { mx, my } = getPos(e);
    const { x, y, size } = crop;
    const resizeDist = Math.hypot(mx - (x + size), my - (y + size));
    if (resizeDist < 16) {
      setDragging('resize');
    } else if (mx >= x && mx <= x + size && my >= y && my <= y + size) {
      setDragging('move');
    }
    setDragStart({ mx, my, cx: x, cy: y, cs: size });
  };

  const onPointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    const { mx, my } = getPos(e);
    const dx = mx - dragStart.mx;
    const dy = my - dragStart.my;

    setCrop(prev => {
      if (dragging === 'move') {
        const nx = Math.max(0, Math.min(displayW - prev.size, dragStart.cx + dx));
        const ny = Math.max(0, Math.min(displayH - prev.size, dragStart.cy + dy));
        return { ...prev, x: nx, y: ny };
      } else {
        const newSize = Math.max(40, Math.min(displayW - dragStart.cx, displayH - dragStart.cy, dragStart.cs + dx, dragStart.cs + dy));
        return { x: dragStart.cx, y: dragStart.cy, size: Math.round(newSize) };
      }
    });
  }, [dragging, dragStart, displayW, displayH]);

  const onPointerUp = () => setDragging(null);

  const handleCropAndUpload = async () => {
    const img = imgRef.current;
    if (!img) return;
    setUploading(true);
    setStatus('Cropping image…');

    // Crop to a square canvas
    const out = document.createElement('canvas');
    const SIZE = 800;
    out.width = SIZE;
    out.height = SIZE;
    const ctx = out.getContext('2d')!;

    const scaleX = naturalW / displayW;
    const scaleY = naturalH / displayH;
    const sx = crop.x * scaleX;
    const sy = crop.y * scaleY;
    const sw = crop.size * scaleX;
    const sh = crop.size * scaleY;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SIZE, SIZE);

    out.toBlob(async (blob) => {
      if (!blob) { setUploading(false); setStatus('Crop failed.'); return; }
      setStatus('Uploading to ImgBB…');

      const fd = new FormData();
      fd.append('image', blob, 'product.jpg');

      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
          method: 'POST',
          body: fd,
        });
        const data = await res.json();
        if (data.success && data.data && data.data.url) {
          setStatus('✓ Uploaded!');
          setTimeout(() => onComplete(data.data.url), 400);
        } else {
          setStatus('Upload failed: ' + (data.error?.message || 'Unknown error'));
          setUploading(false);
        }
      } catch {
        setStatus('Upload error. Check your internet connection.');
        setUploading(false);
      }
    }, 'image/jpeg', 0.92);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease',
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div style={{
        background: 'var(--bg2, #0a0f1c)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '32px',
        maxWidth: 600,
        width: '95vw',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-premium, serif)', fontSize: 20, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
              Crop Image
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted, #4b5a7a)' }}>
              Drag to move · Drag corner to resize · Images are saved as 1:1 square
            </div>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        {/* Canvas */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          background: 'rgba(0,0,0,0.4)', borderRadius: 12,
          overflow: 'hidden', marginBottom: 20,
          cursor: dragging === 'move' ? 'grabbing' : 'crosshair',
        }}>
          <canvas
            ref={canvasRef}
            style={{ display: 'block', maxWidth: '100%', touchAction: 'none' }}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          />
        </div>

        {/* Status */}
        {status && (
          <div style={{ fontSize: 12, color: status.startsWith('✓') ? 'var(--success, #00cc88)' : 'var(--teal, #19D3C5)', marginBottom: 16, textAlign: 'center' }}>
            {status}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={uploading}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--muted, #4b5a7a)',
              padding: '11px 24px', borderRadius: 10,
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-body, sans-serif)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCropAndUpload}
            disabled={uploading || !displayW}
            style={{
              background: uploading ? 'rgba(25,211,197,0.5)' : 'var(--teal, #19D3C5)',
              border: 'none',
              color: '#000',
              padding: '11px 28px', borderRadius: 10,
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 700,
              fontFamily: 'var(--font-body, sans-serif)',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: '0.2s',
            }}
          >
            {uploading ? (
              <>
                <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Uploading…
              </>
            ) : 'Crop & Upload →'}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
