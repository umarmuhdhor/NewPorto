'use client';
import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function HeroScrollBtn() {
  const ref = useRef(null);
  return (
    <p
      ref={ref}
      className={styles.scrollCta}
      onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
    >
      ↓ Scroll to explore
    </p>
  );
}
