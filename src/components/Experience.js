'use client';
import { useState } from 'react';
import styles from './Experience.module.css';

export default function Experience({ experiences }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = experiences?.[activeIdx];

  const expItems = experiences?.filter(e => e.type === 'experience') || [];
  const eduItems = experiences?.filter(e => e.type === 'education') || [];

  return (
    <section id="experience" className={`section ${styles.section}`}>
      <div className="container">
        <p className="section-subheading">// BACKGROUND</p>
        <h2 className="section-heading">Experience & Education</h2>
        <div className={styles.grid}>
          {/* Sidebar tabs */}
          <div className={styles.sidebar}>
            {experiences?.length > 0 && (
              <>
                <p className={styles.tabGroup}>Work</p>
                {expItems.map((exp, i) => {
                  const realIdx = experiences.indexOf(exp);
                  return (
                    <button key={exp.id} className={`${styles.tab} ${activeIdx === realIdx ? styles.tabActive : ''}`}
                      onClick={() => setActiveIdx(realIdx)}>
                      <span className={styles.tabNum}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.tabTitle}>{exp.title}</span>
                    </button>
                  );
                })}
                <p className={styles.tabGroup}>Education</p>
                {eduItems.map((exp, i) => {
                  const realIdx = experiences.indexOf(exp);
                  return (
                    <button key={exp.id} className={`${styles.tab} ${activeIdx === realIdx ? styles.tabActive : ''}`}
                      onClick={() => setActiveIdx(realIdx)}>
                      <span className={styles.tabNum}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.tabTitle}>{exp.title}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Content card */}
          {active && (
            <div className={styles.card} key={active.id}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={`badge ${active.type === 'experience' ? 'badge-experience' : 'badge-education'}`}>
                    {active.type}
                  </span>
                  <h3 className={styles.cardTitle}>{active.title}</h3>
                  <p className={styles.cardOrg}>{active.organization}</p>
                </div>
                <div className={styles.dates}>
                  <span>{active.startDate}</span>
                  <span>→</span>
                  <span>{active.endDate}</span>
                </div>
              </div>
              <div className={styles.divider} />
              <ul className={styles.bulletList}>
                {active.description.split('\n').map((line, i) =>
                  line.trim() ? <li key={i}>{line.replace(/^[-•]\s*/, '')}</li> : null
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
