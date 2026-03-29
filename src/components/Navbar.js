'use client';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ['home', 'about', 'experience', 'tools', 'projects', 'certificates', 'contact'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (href) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.pill}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`${styles.link} ${active === link.href.replace('#', '') ? styles.active : ''}`}
            onClick={(e) => { e.preventDefault(); handleClick(link.href); }}
          >
            {link.label}
          </a>
        ))}
      </div>
      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.mobileLink}
              onClick={(e) => { e.preventDefault(); handleClick(link.href); }}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
