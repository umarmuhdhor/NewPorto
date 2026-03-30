'use client';
import { useState, useEffect } from 'react';

const EMPTY = { title: '', organization: '', description: '', startDate: '', endDate: 'Present', type: 'experience', images: '[]' };

export default function AdminExperiencePage() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | item
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => fetch('/api/admin/experiences').then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (item) => { setForm(item); setModal(item); };
  const closeModal = () => setModal(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        const currentImages = JSON.parse(form.images || '[]');
        currentImages.push(data.url);
        set('images', JSON.stringify(currentImages));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    }
    setSaving(false);
  };

  const removeImage = (index) => {
    const currentImages = JSON.parse(form.images || '[]');
    currentImages.splice(index, 1);
    set('images', JSON.stringify(currentImages));
  };

  const save = async () => {
    setSaving(true);
    if (modal === 'add') {
      await fetch('/api/admin/experiences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/admin/experiences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setSaving(false); closeModal(); load();
  };

  const del = async (id) => {
    if (!confirm('Delete this item?')) return;
    await fetch('/api/admin/experiences', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div>
      <h1 className="admin-page-title">Experience & Education</h1>
      <p className="admin-page-sub">// Work history and education items</p>
      <div className="admin-row" style={{ marginBottom: '24px' }}>
        <button className="admin-btn" onClick={openAdd}>+ Add Item</button>
      </div>

      {items.length === 0 && <div className="admin-empty">No items yet. Click "+ Add Item" to get started.</div>}
      {items.map(item => (
        <div key={item.id} className="admin-list-item">
          <div>
            <p className="admin-list-title">{item.title}</p>
            <p className="admin-list-meta">{item.organization} · {item.startDate} → {item.endDate} · {item.type}</p>
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-ghost" onClick={() => openEdit(item)}>Edit</button>
            <button className="admin-btn admin-btn-danger" onClick={() => del(item.id)}>Delete</button>
          </div>
        </div>
      ))}

      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <p className="admin-modal-title">{modal === 'add' ? 'Add Experience' : 'Edit Experience'}</p>
            <div className="admin-form">
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Type</label>
                  <select className="admin-select" value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="experience">Experience</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Organization</label>
                <input className="admin-input" value={form.organization} onChange={e => set('organization', e.target.value)} />
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">Start Date</label>
                  <input className="admin-input" value={form.startDate} onChange={e => set('startDate', e.target.value)} placeholder="2023" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">End Date</label>
                  <input className="admin-input" value={form.endDate} onChange={e => set('endDate', e.target.value)} placeholder="Present" />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Description (one bullet per line)</label>
                <textarea className="admin-textarea" rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Images (Optional - For Carousel)</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {JSON.parse(form.images || '[]').map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', border: '1px solid var(--cream-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => removeImage(idx)} 
                        title="Remove image"
                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'var(--red, #ff4444)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                  <div style={{ width: '80px', height: '80px', border: '2px dashed var(--cream-dark)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', background: 'var(--cream)' }}>
                    <span style={{ fontSize: '24px', color: 'var(--black)', opacity: 0.5 }}>+</span>
                    <input type="file" onChange={uploadImage} accept="image/*" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} disabled={saving} />
                  </div>
                </div>
              </div>
              <div className="admin-row">
                <button className="admin-btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
                <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
