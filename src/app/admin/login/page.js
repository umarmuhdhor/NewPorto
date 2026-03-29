'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>⚡</div>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>Sign in to manage your portfolio</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className={styles.input} placeholder="admin@porto.dev" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className={styles.input} placeholder="••••••••" required />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className={styles.hint}>Default: admin@porto.dev / admin123</p>
        <a href="/" className={styles.back}>← Back to portfolio</a>
      </div>
    </div>
  );
}
