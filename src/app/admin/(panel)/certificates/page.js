import { useState, useEffect } from 'react';
import UploadImage from '../../components/UploadImage';

const EMPTY = { title: '', issuer: '', description: '', year: '', type: 'Certification', imageUrl: '' };

export default function AdminCertificatesPage() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => fetch('/api/admin/certificates').then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (item) => { setForm(item); setModal(item); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const { url } = await res.json();
    set('imageUrl', url);
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    const method = modal === 'add' ? 'POST' : 'PUT';
    await fetch('/api/admin/certificates', {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    });
    setSaving(false); setModal(null); load();
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch('/api/admin/certificates', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
    });
    load();
  };

  return (
    <div>
      <h1 className="admin-page-title">Certificates &amp; Achievements</h1>
      <p className="admin-page-sub">// Professional certifications and accomplishments</p>
      <div className="admin-row" style={{ marginBottom: '24px' }}>
        <button className="admin-btn" onClick={openAdd}>+ Add Certificate</button>
      </div>

      {items.length === 0 && <div className="admin-empty">No certificates yet.</div>}
      {items.map(item => (
        <div key={item.id} className="admin-list-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {item.imageUrl
              ? <img src={item.imageUrl} alt={item.title} style={{ width: 60, height: 44, objectFit: 'cover', border: '2px solid #000' }} />
              : <div style={{ width: 60, height: 44, background: '#eee', border: '2px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🏆</div>
            }
            <div>
              <p className="admin-list-title">{item.title}</p>
              <p className="admin-list-meta">{item.issuer} · {item.year} · {item.type}</p>
            </div>
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-ghost" onClick={() => openEdit(item)}>Edit</button>
            <button className="admin-btn admin-btn-danger" onClick={() => del(item.id)}>Delete</button>
          </div>
        </div>
      ))}

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <p className="admin-modal-title">{modal === 'add' ? 'Add Certificate' : 'Edit Certificate'}</p>
            <div className="admin-form">
              <UploadImage 
                label="Certificate Image / Photo" 
                value={form.imageUrl} 
                onChange={v => set('imageUrl', v)} 
                placeholder="Image URL or upload" 
              />

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Type</label>
                  <select className="admin-select" value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="Certification">Certification</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Award">Award</option>
                  </select>
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">Issuer / Organization</label>
                  <input className="admin-input" value={form.issuer} onChange={e => set('issuer', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Year</label>
                  <input className="admin-input" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2024" />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea className="admin-textarea" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="admin-row">
                <button className="admin-btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
                <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
