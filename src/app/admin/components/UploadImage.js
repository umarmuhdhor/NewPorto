'use client';
import { useState, useRef } from 'react';

export default function UploadImage({ value, onChange, label = 'Image', placeholder = 'Image URL' }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      });
      
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Check your connection/credentials.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {value && (
          <div style={{ position: 'relative' }}>
            <img 
              src={value} 
              alt="Preview" 
              style={{ width: 80, height: 80, objectFit: 'cover', border: '2px solid #333' }} 
            />
            <button 
              type="button"
              onClick={() => onChange('')}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 20,
                height: 20,
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input 
            className="admin-input" 
            value={value || ''} 
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder} 
            style={{ marginBottom: '8px' }} 
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              className="admin-btn admin-btn-ghost"
              onClick={() => fileRef.current?.click()} 
              disabled={uploading}
            >
              {uploading ? '⏳ Uploading...' : '📁 Upload Image'}
            </button>
            <input 
              ref={fileRef} 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }}
              onChange={handleUpload} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
