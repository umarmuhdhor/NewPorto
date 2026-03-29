'use client';
import { useEffect, useRef } from 'react';
import styles from './CursorFollower.module.css';

// Force Turbopack CSS cache invalidation

export default function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    // Guard: only run on pointer (mouse) devices
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    // Show them now that we know we have a mouse
    dot.style.opacity = '1';
    ringEl.style.opacity = '1';

    pos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    ring.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.1);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.1);
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      raf.current = requestAnimationFrame(animate);
    };

    const onEnterLink = () => ringEl.classList.add(styles.hover);
    const onLeaveLink = () => ringEl.classList.remove(styles.hover);

    document.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(animate);

    // Store targets so we can remove listeners on cleanup
    const targets = Array.from(document.querySelectorAll('a, button, [data-cursor-hover]'));
    targets.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      // Clean up all hover listeners to prevent memory leaks
      targets.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} style={{ opacity: 0 }} />
      <div ref={ringRef} className={styles.ring} style={{ opacity: 0 }} />
    </>
  );
}
