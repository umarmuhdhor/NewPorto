'use client';
import { useRef, useEffect } from 'react';
import styles from './About.module.css';

export default function About({ profile, socialLinks }) {
  const photoColRef = useRef(null);
  const photoFrameRef = useRef(null);
  const imgRef = useRef(null);
  const bioRef = useRef(null);

  useEffect(() => {
    // Only run animations client-side — no SSR conflict
    let gsap, ScrollTrigger;
    try {
      gsap = require('gsap').gsap;
      ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) { return; }

    // 1. Photo Parallax + Glint
    const handleMouseMove = (e) => {
      if (!photoColRef.current) return;
      const { left, top, width, height } = photoColRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to(photoFrameRef.current, {
        rotateY: x * 12, rotateX: -y * 12, x: x * 15, y: y * 15,
        duration: 0.6, ease: 'power2.out'
      });
      gsap.to(imgRef.current, {
        x: -x * 20, y: -y * 20, scale: 1.12,
        duration: 0.8, ease: 'power2.out'
      });

      const gx = 50 + x * 100;
      const gy = 50 + y * 100;
      photoFrameRef.current?.style.setProperty('--glint-x', `${gx}%`);
      photoFrameRef.current?.style.setProperty('--glint-y', `${gy}%`);
    };

    const handleMouseLeave = () => {
      gsap.to([photoFrameRef.current, imgRef.current], {
        rotateX: 0, rotateY: 0, x: 0, y: 0, scale: 1,
        duration: 1.5, ease: 'elastic.out(1, 0.4)'
      });
    };

    const photoCol = photoColRef.current;
    photoCol?.addEventListener('mousemove', handleMouseMove);
    photoCol?.addEventListener('mouseleave', handleMouseLeave);

    // 2. Bio line wipe-in
    if (bioRef.current) {
      const bioLines = bioRef.current.querySelectorAll(`.${styles.bioLine}`);
      gsap.fromTo(bioLines,
        { clipPath: 'inset(0 0 110% 0)', y: 24 },
        {
          clipPath: 'inset(0 0 0% 0)', y: 0,
          duration: 1.4, stagger: 0.18, ease: 'expo.out',
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 3. Animated highlighter markers
      const markers = bioRef.current.querySelectorAll(`.${styles.marker}`);
      markers.forEach((marker) => {
        gsap.fromTo(marker,
          { '--marker-width': '0%' },
          {
            '--marker-width': '100%', duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: marker, start: 'top 90%', toggleActions: 'play none none reverse' }
          }
        );
      });
    }

    return () => {
      photoCol?.removeEventListener('mousemove', handleMouseMove);
      photoCol?.removeEventListener('mouseleave', handleMouseLeave);
      ScrollTrigger?.getAll().forEach(st => st.kill());
    };
  }, []);

  const renderBio = (bio) => {
    if (!bio) return <p className={styles.bioLine} style={{ opacity: 0.5 }}>Bio coming soon...</p>;
    return bio.split('\n').filter(Boolean).map((segment, i) => (
      <p key={i} className={styles.bioLine}>
        {segment.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={j} className={styles.marker}>{part.slice(2, -2)}</span>;
          }
          return part;
        })}
      </p>
    ));
  };

  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        <div className={styles.grid}>
          {/* Photo Column */}
          <div className={styles.photoCol} ref={photoColRef}>
            <div className={styles.photoFrame} ref={photoFrameRef}>
              <div className={styles.photoInner}>
                {profile?.photoUrl ? (
                  <img
                    ref={imgRef}
                    src={profile.photoUrl}
                    alt={profile?.name || 'Profile'}
                    className={styles.photo}
                  />
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

          {/* Content Column */}
          <div className={styles.contentCol}>
            <p className={styles.label}>// WHO AM I</p>
            <h2 className={`section-heading ${styles.name}`}>{profile?.name || 'Your Name'}</h2>
            <p className={styles.titleLine}>{profile?.title || 'Developer & Creator'}</p>
            <div className={styles.divider} />

            <div className={styles.bio} ref={bioRef}>
              {renderBio(profile?.bio)}
            </div>

            <div className={styles.actions}>
              <a
                href="#contact"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Let's Collaborate →
              </a>
              {profile?.cvUrl && (
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Curriculum Vitae ↓
                </a>
              )}
            </div>

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
    </section>
  );
}
