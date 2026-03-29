'use client';
import { useState } from 'react';
import styles from './About.module.css';

function Marquee({ text }) {
  const items = Array(10).fill(text);
  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="marquee-item">{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function About({ profile, socialLinks }) {
  const renderBio = (bio) => {
    if (!bio) return null;
    return bio.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <section id="about">
      <Marquee text="ABOUT ME" />
      <div className={`section ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.grid}>
            {/* Photo */}
            <div className={styles.photoCol}>
              <div className={styles.photoFrame} data-animate="photo">
                <div className={styles.photoInner}>
                  {profile?.photoUrl ? (
                    <img src={profile.photoUrl} alt={profile.name} className={styles.photo} />
                  ) : (
                    <div className={styles.photoPlaceholder}>
                      <span>📸</span>
                      <p>Photo coming soon</p>
                    </div>
                  )}
                </div>
                <div className={styles.photoShadow} />
              </div>
            </div>

            {/* Content */}
            <div className={styles.contentCol}>
              <p className={styles.label}>// WHO AM I</p>
              <h2 className={`section-heading ${styles.name}`}>{profile?.name || 'Your Name'}</h2>
              <p className={styles.titleLine}>{profile?.title || 'Developer & Creator'}</p>
              <div className={styles.divider} />
              <p className={styles.bio}>{renderBio(profile?.bio)}</p>
              <div className={styles.actions}>
                <a href="#contact" className="btn-primary"
                  onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  CONTACT ME →
                </a>
                {profile?.cvUrl && (
                  <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    DOWNLOAD CV ↓
                  </a>
                )}
              </div>
              {/* Social links */}
              {socialLinks?.length > 0 && (
                <div className={styles.socials}>
                  {socialLinks.map((s) => (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                      {s.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
