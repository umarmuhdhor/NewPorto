import { useState, useEffect } from 'react';
import UploadImage from '../../components/UploadImage';

const CATS = ['Language', 'Framework', 'Runtime', 'Database', 'Cloud', 'DevOps', 'ORM', 'Design', 'Tool', 'Other'];
const EMPTY = { name: '', iconUrl: '', category: 'Language' };

export default function AdminToolsPage() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => fetch('/api/admin/tools').then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (item) => { setForm(item); setModal(item); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const method = modal === 'add' ? 'POST' : 'PUT';
    await fetch('/api/admin/tools', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setModal(null); load();
  };

  const del = async (id) => {
    if (!confirm('Delete this tool?')) return;
    await fetch('/api/admin/tools', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div>
      <h1 className="admin-page-title">Tools & Languages</h1>
      <p className="admin-page-sub">// Your tech stack and skills</p>
      <div className="admin-row" style={{ marginBottom: '24px' }}>
        <button className="admin-btn" onClick={openAdd}>+ Add Tool</button>
      </div>

      {items.length === 0 && <div className="admin-empty">No tools yet.</div>}
      {items.map(item => (
        <div key={item.id} className="admin-list-item">
          <div>
            <p className="admin-list-title">{item.name}</p>
            <p className="admin-list-meta">{item.category}</p>
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
            <p className="admin-modal-title">{modal === 'add' ? 'Add Tool' : 'Edit Tool'}</p>
            <div className="admin-form">
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">Tool Name</label>
                  <input className="admin-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="React" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Category</label>
                  <select className="admin-select" value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <UploadImage 
                label="Tool Icon (Emoji or URL)" 
                value={form.iconUrl} 
                onChange={v => set('iconUrl', v)} 
                placeholder="Paste emoji or upload icon" 
              />
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
