'use client';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Contact.module.css';

function MagneticCTA({ profile }) {
  const ctaRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ctaRef.current) return;
      const { left, top, width, height } = ctaRef.current.getBoundingClientRect();
      const x = e.clientX - (left + width / 2);
      const y = e.clientY - (top + height / 2);
      
      // Magnetic pull
      gsap.to(ctaRef.current, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.6,
        ease: 'power2.out'
      });

      if (isCopied) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(ctaRef.current, {
        x: 0, y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    ctaRef.current?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isCopied]);

  const copyToClipboard = () => {
    if (!profile?.email) return;
    navigator.clipboard.writeText(profile.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={styles.infoCol}>
      <div 
        ref={ctaRef}
        className={styles.massiveCta}
        onClick={copyToClipboard}
      >
        <div className={styles.magneticWrap}>
          <span className={styles.ctaText}>Let's</span>
          <span className={`${styles.ctaText} ${styles.ctaOutline}`}>Talk</span>
        </div>
        <span className={styles.emailSub}>{profile?.email || 'hello@yourdomain.com'}</span>
      </div>

      {isCopied && (
        <div 
          className={styles.copyBadge}
          style={{ 
            left: mousePos.x + 15, 
            top: mousePos.y + 15 
          }}
        >
          Copied to clipboard! 📋
        </div>
      )}

      <div className={styles.infoItems}>
        <div className={styles.infoItem}>
          <span>📍 INDONESIA</span>
          <span style={{ opacity: 0.3 }}>—</span>
          <span>AVAILABLE FOR HIRE</span>
        </div>
      </div>
    </div>
  );
}

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {/* Interaction Side */}
          <MagneticCTA profile={profile} />

          {/* Form Side */}
          <div className={styles.formCol}>
            {status === 'success' ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>✓</div>
                <h3>Message Sent!</h3>
                <p>I'll get back to you faster than a git push. Thanks!</p>
                <button className="btn-secondary" onClick={() => setStatus('idle')}>Send Another</button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div>
                    <label className={styles.label}>Name</label>
                    <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Umar Muhdhor" required />
                  </div>
                  <div>
                    <label className={styles.label}>Email</label>
                    <input type="email" className={styles.input} value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="umar@example.com" required />
                  </div>
                </div>
                <div>
                  <label className={styles.label}>Subject</label>
                  <input className={styles.input} value={form.subject} onChange={e => set('subject', e.target.value)}
                    placeholder="Project Inquiry" required />
                </div>
                <div>
                  <label className={styles.label}>Message</label>
                  <textarea className={styles.textarea} rows={4} value={form.message}
                    onChange={e => set('message', e.target.value)} placeholder="Let's build something great..." required />
                </div>
                {status === 'error' && (
                  <p className={styles.errorMsg}>Something went wrong. High ping? Try again!</p>
                )}
                <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

