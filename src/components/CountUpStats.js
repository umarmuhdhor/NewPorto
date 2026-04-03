'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

export default function CountUpStats({ projects, experiences }) {
  const [mounted, setMounted] = useState(false);
  const [counts, setCounts] = useState({ projects: 0, exp: 0 });
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1400;
          const steps = 50;
          const stepTime = duration / steps;
          let step = 0;
          const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            const ease = 1 - Math.pow(1 - progress, 3);
            setCounts({
              projects: Math.round(projects * ease),
              exp: Math.round(experiences * ease),
            });
            if (step >= steps) clearInterval(interval);
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, projects, experiences]);

  if (!mounted) {
    // Render placeholder with same structure to avoid layout shift
    return (
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>—</span>
          <span className={styles.statLabel}>Projects</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>—</span>
          <span className={styles.statLabel}>Experiences</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>—</span>
          <span className={styles.statLabel}>Committed</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={styles.stats}>
      <div className={styles.statItem}>
        <span className={styles.statNum}>{counts.projects}+</span>
        <span className={styles.statLabel}>Projects</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNum}>{counts.exp}+</span>
        <span className={styles.statLabel}>Experiences</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNum}>100%</span>
        <span className={styles.statLabel}>Committed</span>
      </div>
    </div>
  );
}

