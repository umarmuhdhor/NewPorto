'use client';
import { useEffect } from 'react';

export default function SmoothScrollProvider() {
  useEffect(() => {
    let lenis;
    const init = async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    };
    init();
    return () => lenis?.destroy();
  }, []);

  return null;
}
