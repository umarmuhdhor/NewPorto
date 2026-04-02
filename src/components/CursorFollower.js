'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './CursorFollower.module.css';

export default function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    dot.style.opacity = '1';
    ringEl.style.opacity = '1';

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.15);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.15);
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      raf.current = requestAnimationFrame(animate);
    };

    // Smart Hover detection using event delegation
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor]');
      if (!target) {
        ringEl.classList.remove(styles.hover, styles.detail);
        setCursorText('');
        return;
      }

      if (target.hasAttribute('data-cursor')) {
        ringEl.classList.add(styles.detail);
        setCursorText(target.getAttribute('data-cursor'));
      } else {
        ringEl.classList.add(styles.hover);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, [data-cursor]');
      if (target) {
        ringEl.classList.remove(styles.hover, styles.detail);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} style={{ opacity: 0 }} />
      <div ref={ringRef} className={styles.ring} style={{ opacity: 0 }}>
        <span className={styles.cursorText}>{cursorText}</span>
      </div>
    </>
  );
}

