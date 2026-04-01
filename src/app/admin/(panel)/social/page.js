'use client';
import { useState, useEffect } from 'react';

const EMPTY = { platform: '', url: '', icon: '' };

export default function AdminSocialPage() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => fetch('/api/admin/social').then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (item) => { setForm(item); setModal(item); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const method = modal === 'add' ? 'POST' : 'PUT';
    await fetch('/api/admin/social', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(null); load();
  };

  const del = async (id) => {
    if (!confirm('Delete this link?')) return;
    await fetch('/api/admin/social', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div>
      <h1 className="admin-page-title">Social Links</h1>
      <p className="admin-page-sub">// Displayed in About section and footer</p>
      <div className="admin-row" style={{ marginBottom: '24px' }}>
        <button className="admin-btn" onClick={openAdd}>+ Add Link</button>
      </div>

      {items.length === 0 && <div className="admin-empty">No social links yet.</div>}
      {items.map(item => (
        <div key={item.id} className="admin-list-item">
          <div>
            <p className="admin-list-title">{item.platform}</p>
            <p className="admin-list-meta">{item.url}</p>
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
            <p className="admin-modal-title">{modal === 'add' ? 'Add Social Link' : 'Edit Social Link'}</p>
            <div className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Platform Name</label>
                <input className="admin-input" value={form.platform} onChange={e => set('platform', e.target.value)} placeholder="GitHub, LinkedIn, Twitter..." />
              </div>
              <div className="admin-field">
                <label className="admin-label">URL</label>
                <input className="admin-input" value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." />
              </div>
              <div className="admin-field">
                <label className="admin-label">Icon Name (lucide icon or platform name)</label>
                <input className="admin-input" value={form.icon || ''} onChange={e => set('icon', e.target.value)} placeholder="github, linkedin, mail, etc." />
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
