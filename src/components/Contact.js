'use client';
import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
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
    <section id="contact" className={`section ${styles.section}`}>
      <div className="container">
        <p className="section-subheading">// SAY HELLO</p>
        <h2 className="section-heading">Get In Touch</h2>
        <p className={styles.intro}>
          Have a project in mind, a question, or just want to connect? I'd love to hear from you.
        </p>

        <div className={styles.grid}>
          {/* Contact Info */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>// LET'S TALK</p>
              <p className={styles.infoBig}>Open to opportunities, collaborations, and interesting conversations.</p>
              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📍</span>
                  <div>
                    <p className={styles.infoItemLabel}>Location</p>
                    <p className={styles.infoItemValue}>Indonesia</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>⏰</span>
                  <div>
                    <p className={styles.infoItemLabel}>Response Time</p>
                    <p className={styles.infoItemValue}>Within 24 hours</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>🤝</span>
                  <div>
                    <p className={styles.infoItemLabel}>Status</p>
                    <p className={styles.infoItemValue}>Available for hire</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formCol}>
            {status === 'success' ? (
              <div className={styles.successCard}>
                <span className={styles.successIcon}>✓</span>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. I'll get back to you soon.</p>
                <button className="btn-secondary" onClick={() => setStatus('idle')}>Send Another</button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.label}>Name *</label>
                    <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Your name" required />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Email *</label>
                    <input type="email" className={styles.input} value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="your@email.com" required />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>Subject *</label>
                  <input className={styles.input} value={form.subject} onChange={e => set('subject', e.target.value)}
                    placeholder="What's this about?" required />
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>Message *</label>
                  <textarea className={styles.textarea} rows={5} value={form.message}
                    onChange={e => set('message', e.target.value)} placeholder="Tell me more..." required />
                </div>
                {status === 'error' && (
                  <p className={styles.errorMsg}>Something went wrong. Please try again or email directly.</p>
                )}
                <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={status === 'sending'}>
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
