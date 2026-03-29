'use client';
import { useEffect, useRef } from 'react';
import styles from './PageCurtain.module.css';

export default function PageCurtain() {
  const curtainRef = useRef(null);

  useEffect(() => {
    const el = curtainRef.current;
    if (!el) return;

    // Start visible, then slide down to reveal page
    const timer = setTimeout(() => {
      el.style.transform = 'scaleY(0)';
      el.style.transformOrigin = 'top';
    }, 100);

    // Remove from DOM after animation
    const cleanup = setTimeout(() => {
      el.style.display = 'none';
    }, 1100);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, []);

  return <div ref={curtainRef} className={styles.curtain} />;
}
