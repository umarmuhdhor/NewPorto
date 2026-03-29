'use client';
import { useEffect, useRef } from 'react';

/**
 * MagneticButton — wraps any element and adds a magnetic pull effect on hover.
 * Usage: <MagneticButton strength={0.4}><button>Click me</button></MagneticButton>
 */
export default function MagneticButton({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const onLeave = () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
    };

    const onEnter = () => {
      el.style.transition = 'transform 0.1s linear';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mouseenter', onEnter);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mouseenter', onEnter);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
}
