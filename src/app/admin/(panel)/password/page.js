'use client';
import { useState } from 'react';

export default function AdminPasswordPage() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) { setMsg('Passwords do not match.'); return; }
    if (form.newPass.length < 6) { setMsg('Password must be at least 6 characters.'); return; }
    setSaving(true); setMsg('');
    const res = await fetch('/api/admin/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: form.current, newPass: form.newPass }),
    });
    setSaving(false);
    const data = await res.json();
    setMsg(res.ok ? '✓ Password updated!' : (data.error || 'Error updating password.'));
    if (res.ok) setForm({ current: '', newPass: '', confirm: '' });
  };

  const isSuccess = msg.startsWith('✓');

  return (
    <div>
      <h1 className="admin-page-title">Change Password</h1>
      <p className="admin-page-sub">// Update your admin login password</p>
      <div className="admin-card" style={{ maxWidth: '480px' }}>
        <form className="admin-form" onSubmit={save}>
          <div className="admin-field">
            <label className="admin-label">Current Password</label>
            <input type="password" className="admin-input" value={form.current}
              onChange={e => set('current', e.target.value)} required />
          </div>
          <div className="admin-field">
            <label className="admin-label">New Password</label>
            <input type="password" className="admin-input" value={form.newPass}
              onChange={e => set('newPass', e.target.value)} required minLength={6} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Confirm New Password</label>
            <input type="password" className="admin-input" value={form.confirm}
              onChange={e => set('confirm', e.target.value)} required />
          </div>
          {msg && <p className={isSuccess ? 'admin-success' : 'admin-error'}>{msg}</p>}
          <div>
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? 'Updating...' : '🔐 Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
