'use client';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './admin.module.css';

const NAV = [
  { href: '/admin', label: '📊 Dashboard', exact: true },
  { href: '/admin/profile', label: '👤 Profile' },
  { href: '/admin/experience', label: '💼 Experience' },
  { href: '/admin/tools', label: '🛠️ Tools' },
  { href: '/admin/projects', label: '🚀 Projects' },
  { href: '/admin/certificates', label: '🏆 Certificates' },
  { href: '/admin/social', label: '🔗 Social Links' },
];

const SETTINGS = [
  { href: '/admin/password', label: '🔐 Change Password' },
];

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const isActive = (item) => item.exact ? pathname === '/admin' : pathname.startsWith(item.href);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/admin" className={styles.brand}>
            <span className={styles.brandIcon}>⚡</span>
            <span className={styles.brandText}>Admin</span>
          </Link>
        </div>
        <nav className={styles.nav}>
          <p className={styles.navGroup}>Content</p>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className={`${styles.navLink} ${isActive(item) ? styles.navLinkActive : ''}`}>
              {item.label}
            </Link>
          ))}
          <p className={styles.navGroup}>Settings</p>
          {SETTINGS.map((item) => (
            <Link key={item.href} href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.viewSite} target="_blank">↗ View Portfolio</Link>
          <button className={styles.signOut} onClick={() => signOut({ callbackUrl: '/admin/login' })}>
            Sign Out
          </button>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
