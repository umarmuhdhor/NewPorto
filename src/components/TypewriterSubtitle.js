'use client';
import { useEffect, useState } from 'react';
import styles from './Hero.module.css';

export default function TypewriterSubtitle({ text, delay = 1000 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    // Delay start so it syncs with main intro sequence
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 60);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  return (
    <span className={styles.subtitle}>
      {displayed}
      {!done && <span className={styles.cursor}>|</span>}
    </span>
  );
}
