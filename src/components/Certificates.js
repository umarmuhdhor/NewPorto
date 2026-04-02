'use client';
import { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Certificates.module.css';

export default function Certificates({ certificates }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  
  const lightboxRef = useRef(null);
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    if (lightbox && lightboxRef.current && imgRef.current) {
      gsap.fromTo(lightboxRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(imgRef.current,
        { scale: 0.8, filter: 'blur(10px)', opacity: 0 },
        { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }
  }, [lightbox]);

  if (!certificates || certificates.length === 0) return null;

  const cert = certificates[activeIdx];
  const prev = () => setActiveIdx((i) => (i - 1 + certificates.length) % certificates.length);
  const next = () => setActiveIdx((i) => (i + 1) % certificates.length);

  return (
    <section id="certificates" className={`section ${styles.section}`}>
      <div className="container">
        <p className="section-subheading">// RECOGNITION</p>
        <div className={styles.headingRow}>
          <h2 className={`section-heading ${styles.heading}`}>
            CERTI<span className={styles.headingOutline}>FICATES</span>
          </h2>
          <p className={styles.count}>{String(activeIdx + 1).padStart(2, '0')} / {String(certificates.length).padStart(2, '0')}</p>
        </div>

        {/* Main card */}
        <div className={styles.mainCard} key={cert.id} data-animate="card">
          {/* Image side */}
          <div className={styles.imageCol}>
            {cert.imageUrl ? (
              <div 
                className={styles.imageWrap} 
                onClick={() => setLightbox(cert.imageUrl)}
                data-cursor="ZOOM"
              >
                <img src={cert.imageUrl} alt={cert.title} className={styles.certImage} />
                <div className={styles.imageOverlay}>
                  <span className={styles.zoomIcon}>🔍 VIEW FULL</span>
                </div>
              </div>
            ) : (
              <div className={styles.imagePlaceholder}>
                <div className={styles.placeholderInner}>
                  <span className={styles.placeholderIcon}>🏆</span>
                  <p className={styles.placeholderText}>Certificate Image</p>
                  <p className={styles.placeholderSub}>Upload via admin panel</p>
                </div>
              </div>
            )}
          </div>

          {/* Content side */}
          <div className={styles.contentCol}>
            <div className={styles.badges}>
              <span className={`badge ${cert.type === 'Certification' ? 'badge-cert' : 'badge-achievement'}`}>
                {cert.type}
              </span>
              {cert.year && <span className={styles.year}>{cert.year}</span>}
            </div>
            <h3 className={styles.certTitle}>{cert.title}</h3>
            <p className={styles.certIssuer}>Issued by <strong>{cert.issuer}</strong></p>
            {cert.description && (
              <p className={styles.certDesc}>{cert.description}</p>
            )}

            {/* Navigation */}
            <div className={styles.nav}>
              <button className={styles.navBtn} onClick={prev} aria-label="Previous">← PREV</button>
              <div className={styles.dots}>
                {certificates.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ''}`}
                    onClick={() => setActiveIdx(i)}
                  />
                ))}
              </div>
              <button className={styles.navBtn} onClick={next} aria-label="Next">NEXT →</button>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {certificates.length > 1 && (
          <div className={styles.thumbStrip}>
            {certificates.map((c, i) => (
              <button
                key={c.id}
                className={`${styles.thumb} ${i === activeIdx ? styles.thumbActive : ''}`}
                onClick={() => setActiveIdx(i)}
              >
                {c.imageUrl
                  ? <img src={c.imageUrl} alt={c.title} className={styles.thumbImg} />
                  : <span className={styles.thumbPlaceholder}>🏆</span>
                }
                <span className={styles.thumbLabel}>{c.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox 2.0 */}
      {lightbox && (
        <div className={styles.lightbox} ref={lightboxRef} onClick={() => setLightbox(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} ref={imgRef} alt="Certificate" className={styles.lightboxImg} />
        </div>
      )}
    </section>
  );
}

