import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [projCount, expCount, toolCount, certCount] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.tool.count(),
    prisma.certificate.count(),
  ]);

  const stats = [
    { label: 'Projects', count: projCount, href: '/admin/projects', icon: '🚀' },
    { label: 'Experiences', count: expCount, href: '/admin/experience', icon: '💼' },
    { label: 'Tools', count: toolCount, href: '/admin/tools', icon: '🛠️' },
    { label: 'Certificates', count: certCount, href: '/admin/certificates', icon: '🏆' },
  ];

  const sections = [
    { href: '/admin/profile', icon: '👤', label: 'Edit Profile', desc: 'Name, bio, photo, CV link' },
    { href: '/admin/experience', icon: '💼', label: 'Experience', desc: 'Work history & education' },
    { href: '/admin/tools', icon: '🛠️', label: 'Tools & Languages', desc: 'Tech stack & tools' },
    { href: '/admin/projects', icon: '🚀', label: 'Projects', desc: 'Portfolio projects' },
    { href: '/admin/certificates', icon: '🏆', label: 'Certificates', desc: 'Certs & achievements' },
    { href: '/admin/social', icon: '🔗', label: 'Social Links', desc: 'GitHub, LinkedIn, etc.' },
  ];

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">Welcome back! Manage your portfolio content below.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {stats.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div className="admin-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: '#ffe600' }}>{s.count}</span>
              <span style={{ fontSize: '0.75rem', color: '#555', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <h2 style={{ fontSize: '0.75rem', color: '#444', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Manage Content</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {sections.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div className="admin-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
              <div>
                <p style={{ fontWeight: 700, color: '#ddd', fontSize: '0.88rem', marginBottom: '2px' }}>{s.label}</p>
                <p style={{ fontSize: '0.72rem', color: '#555', fontFamily: 'monospace' }}>{s.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
