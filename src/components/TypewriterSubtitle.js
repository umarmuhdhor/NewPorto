'use client';
import { useEffect, useState } from 'react';
import styles from './Hero.module.css';

export default function TypewriterSubtitle({ text }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    // Delay start so page curtain has lifted
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
    }, 1000);
    return () => clearTimeout(startTimer);
  }, [text]);

  return (
    <span className={styles.subtitle}>
      {displayed}
      {!done && <span className={styles.cursor}>|</span>}
    </span>
  );
}
