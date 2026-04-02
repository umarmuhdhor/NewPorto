'use client';
import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import styles from './About.module.css';

function Marquee({ text }) {
  const items = Array(12).fill(text);
  return (
    <div className="marquee-wrapper" style={{ opacity: 0.1, marginBottom: '-2rem', scale: '1.1' }}>
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="marquee-item" style={{ fontWeight: 900 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function About({ profile, socialLinks }) {
  const sectionRef = useRef(null);
  const photoColRef = useRef(null);
  const photoFrameRef = useRef(null);
  const imgRef = useRef(null);
  const bioRef = useRef(null);

  useLayoutEffect(() => {
    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    // 1. Photo Parallax Logic
    const handleMouseMove = (e) => {
      if (!photoColRef.current) return;
      const { left, top, width, height } = photoColRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      // Tilt the frame
      gsap.to(photoFrameRef.current, {
        rotateY: x * 15,
        rotateX: -y * 15,
        x: x * 20,
        y: y * 20,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Move the image slightly more for depth
      gsap.to(imgRef.current, {
        x: -x * 30,
        y: -y * 30,
        scale: 1.15,
        duration: 0.8,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to([photoFrameRef.current, imgRef.current], {
        rotateX: 0, rotateY: 0, x: 0, y: 0, scale: 1.1,
        duration: 1, ease: 'elastic.out(1, 0.5)'
      });
    };

    const photoCol = photoColRef.current;
    photoCol?.addEventListener('mousemove', handleMouseMove);
    photoCol?.addEventListener('mouseleave', handleMouseLeave);

    // 2. Bio Staggered Reveal
    const bioLines = bioRef.current.querySelectorAll(`.${styles.bioLine}`);
    gsap.fromTo(bioLines,
      { opacity: 0, y: 40, filter: 'blur(10px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.2,
        stagger: 0.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: bioRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      photoCol?.removeEventListener('mousemove', handleMouseMove);
      photoCol?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const renderBio = (bio) => {
    if (!bio) return null;
    // Split by double newlines or single robust segments
    return bio.split('\n').filter(Boolean).map((segment, i) => (
      <span key={i} className={styles.bioLine}>
        {segment.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </span>
    ));
  };

  return (
    <section id="about" ref={sectionRef} className={styles.aboutSection}>
      <Marquee text="ABOUT UMAR MUHDHOR" />
      
      <div className="container">
        <div className={styles.grid}>
          {/* Photo Column with 3D Effect */}
          <div className={styles.photoCol} ref={photoColRef}>
            <div className={styles.photoFrame} ref={photoFrameRef}>
              <div className={styles.photoInner}>
                {profile?.photoUrl ? (
                  <img 
                    ref={imgRef}
                    src={profile.photoUrl} 
                    alt={profile.name} 
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
            <p className={styles.label}>// ORIGIN STORY</p>
            <h2 className={`section-heading ${styles.name}`}>{profile?.name || 'Your Name'}</h2>
            <p className={styles.titleLine}>{profile?.title || 'Developer & Creator'}</p>
            <div className={styles.divider} />
            
            <div className={styles.bio} ref={bioRef}>
              {renderBio(profile?.bio)}
            </div>

            <div className={styles.actions}>
              <a href="#contact" className="btn-primary"
                onClick={(e) => { 
                  e.preventDefault(); 
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); 
                }}
              >
                GET IN TOUCH &rarr;
              </a>
              {profile?.cvUrl && (
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  RESUME.PDF &darr;
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
    </section>
  );
}

