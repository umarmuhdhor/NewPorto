import { useState, useEffect } from 'react';
import UploadImage from '../../components/UploadImage';

const EMPTY = { title: '', subtitle: '', description: '', backstory: '', flow: '', techStack: '', imageUrl: '', status: 'Completed', codeUrl: '', liveUrl: '', role: '', date: '' };

export default function AdminProjectsPage() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = () => fetch('/api/admin/projects').then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setSaveError(''); setModal('add'); };
  const openEdit = (item) => { setForm(item); setSaveError(''); setModal(item); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const method = modal === 'add' ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Save failed. Please try again.');
      }
      setModal(null);
      load();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this project?')) return;
    await fetch('/api/admin/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div>
      <h1 className="admin-page-title">Projects</h1>
      <p className="admin-page-sub">// Showcase your work</p>
      <div className="admin-row" style={{ marginBottom: '24px' }}>
        <button className="admin-btn" onClick={openAdd}>+ Add Project</button>
      </div>

      {items.length === 0 && <div className="admin-empty">No projects yet.</div>}
      {items.map(item => (
        <div key={item.id} className="admin-list-item">
          <div>
            <p className="admin-list-title">{item.title}</p>
            <p className="admin-list-meta">{item.subtitle} · {item.status} · {item.date}</p>
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
            <p className="admin-modal-title">{modal === 'add' ? 'Add Project' : 'Edit Project'}</p>
            <div className="admin-form">
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Status</label>
                  <select className="admin-select" value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Subtitle</label>
                <input className="admin-input" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea className="admin-textarea" rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Backstory</label>
                <textarea className="admin-textarea" rows={4} value={form.backstory} onChange={e => set('backstory', e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Alur / Flow</label>
                <textarea className="admin-textarea" rows={4} value={form.flow} onChange={e => set('flow', e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Tech Stack (comma separated)</label>
                <input className="admin-input" value={form.techStack} onChange={e => set('techStack', e.target.value)} placeholder="Next.js, React, Tailwind CSS" />
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">Role</label>
                  <input className="admin-input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Full-Stack Developer" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Date / Year</label>
                  <input className="admin-input" value={form.date} onChange={e => set('date', e.target.value)} placeholder="2024" />
                </div>
              </div>
              <UploadImage 
                label="Project Image" 
                value={form.imageUrl} 
                onChange={v => set('imageUrl', v)} 
                placeholder="Image URL or upload" 
              />
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">Code URL</label>
                  <input className="admin-input" value={form.codeUrl} onChange={e => set('codeUrl', e.target.value)} placeholder="https://github.com/..." />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Live URL</label>
                  <input className="admin-input" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="admin-row">
                {saveError && (
                  <p style={{ color: 'var(--accent-red, #ff4444)', fontSize: '0.85rem', marginBottom: '8px', width: '100%' }}>
                    ⚠ {saveError}
                  </p>
                )}
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
