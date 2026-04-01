'use client';
import { useState, useEffect, useRef } from 'react';
import UploadImage from '../../components/UploadImage';

export default function AdminProfilePage() {
  const [form, setForm] = useState({ name: '', title: '', bio: '', photoUrl: '', cvUrl: '', github: '', linkedin: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetch('/api/admin/profile').then(r => r.json()).then(d => { if (d) setForm(d); });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) set('photoUrl', data.url);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    const { id, createdAt, updatedAt, ...data } = form;
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setMsg(res.ok ? '✓ Saved successfully!' : 'Error saving.');
  };

  const isSuccess = msg.startsWith('✓');

  return (
    <div>
      <h1 className="admin-page-title">Profile</h1>
      <p className="admin-page-sub">// Your personal info shown on the portfolio</p>
      <div className="admin-card">
        <form className="admin-form" onSubmit={save}>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">Full Name</label>
              <input className="admin-input" value={form.name || ''} onChange={e => set('name', e.target.value)}
                placeholder="Your Name" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Title / Role</label>
              <input className="admin-input" value={form.title || ''} onChange={e => set('title', e.target.value)}
                placeholder="Full-Stack Developer" />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Bio (use **text** to highlight keywords in bold yellow)</label>
            <textarea className="admin-textarea" rows={6} value={form.bio || ''}
              onChange={e => set('bio', e.target.value)}
              placeholder="Passionate developer specializing in **Web Development** and **Cloud Computing**..." />
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">LinkedIn URL</label>
              <input className="admin-input" value={form.linkedin || ''} onChange={e => set('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="admin-field">
              <label className="admin-label">GitHub URL</label>
              <input className="admin-input" value={form.github || ''} onChange={e => set('github', e.target.value)}
                placeholder="https://github.com/..." />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Email Address / mailto: link</label>
            <input className="admin-input" value={form.email || ''} onChange={e => set('email', e.target.value)}
              placeholder="mailto:you@example.com" />
          </div>

          {/* Photo upload */}
          <UploadImage 
            label="Profile Photo" 
            value={form.photoUrl} 
            onChange={v => set('photoUrl', v)} 
            placeholder="Paste a URL or upload" 
          />

          <div className="admin-field">
            <label className="admin-label">CV / Resume URL</label>
            <input className="admin-input" value={form.cvUrl || ''} onChange={e => set('cvUrl', e.target.value)}
              placeholder="https://drive.google.com/..." />
          </div>

          {msg && <p className={isSuccess ? 'admin-success' : 'admin-error'}>{msg}</p>}
          <div>
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Profile'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: '8px' }}>
        <p style={{ color: '#555', fontSize: '0.78rem', fontFamily: 'monospace', lineHeight: '1.7' }}>
          💡 <strong style={{ color: '#888' }}>Bio tip:</strong> Wrap keywords in double asterisks to make them <strong>bold and highlighted</strong>:<br />
          Example: <code style={{ color: '#ffe600' }}>specializing in **React** and **Node.js**</code>
        </p>
      </div>
    </div>
  );
}
