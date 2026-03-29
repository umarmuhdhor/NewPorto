'use client';
import { useEffect } from 'react';

export default function GSAPAnimations() {
  useEffect(() => {
    let ctx;
    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // ─── Hero Entrance & Parallax ───
        const heroInner = document.querySelector('[data-animate="hero-inner"]');
        if (heroInner) {
          const entranceAnim = gsap.fromTo(heroInner,
            { opacity: 0, y: 80, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'expo.out', delay: 0.6 }
          );
          entranceAnim.eventCallback('onComplete', () => {
            gsap.to(heroInner, {
              y: 250, opacity: 0, ease: 'none',
              scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
            });
          });
        }

        // ─── Hero Marquee Scroll Scrubbing ───
        gsap.utils.toArray('[class*="Hero_marqueeRow"]').forEach((row, i) => {
          gsap.to(row, {
            x: i % 2 === 0 ? '-15vw' : '15vw', ease: 'none',
            scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1 }
          });
        });

        // ─── Section headings — Dramatic wipe from bottom ───
        gsap.utils.toArray('.section-heading').forEach((el) => {
          gsap.fromTo(el,
            { clipPath: 'inset(100% 0 0 0)', y: 60, opacity: 0 },
            { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 85%' } }
          );
        });

        // ─── Section subheadings ───
        gsap.utils.toArray('.section-subheading').forEach((el) => {
          gsap.fromTo(el,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%' } }
          );
        });

        // ─── Project cards — Elastic brutalist pop ───
        gsap.utils.toArray('[data-animate="card"]').forEach((el, i) => {
          gsap.fromTo(el,
            { y: 120, opacity: 0, rotation: i % 2 === 0 ? -8 : 8, scale: 0.8 },
            {
              y: 0, opacity: 1, rotation: i % 2 === 0 ? 1.5 : -1, scale: 1,
              duration: 1.2, delay: i * 0.1, ease: 'elastic.out(1, 0.6)',
              scrollTrigger: { trigger: el, start: 'top 85%' },
              onComplete: () => gsap.set(el, { clearProps: 'transform' })
            }
          );
        });

        // ─── Tool cards — Staggered scale pop ───
        gsap.utils.toArray('[data-animate="tool"]').forEach((el, i) => {
          gsap.fromTo(el,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.7, delay: i * 0.02, ease: 'back.out(2.5)',
              scrollTrigger: { trigger: el, start: 'top 95%' } }
          );
        });

        // ─── About photo ───
        const photoFrame = document.querySelector('[data-animate="photo"]');
        if (photoFrame) {
          gsap.fromTo(photoFrame,
            { x: -100, opacity: 0, rotation: -12, scale: 0.8 },
            { x: 0, opacity: 1, rotation: -3, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.75)',
              scrollTrigger: { trigger: photoFrame, start: 'top 85%' } }
          );
        }

        // ─── About bio lines ───
        gsap.utils.toArray('[data-animate="tab"]').forEach((el, i) => {
          gsap.fromTo(el,
            { x: -40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, delay: i * 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%' } }
          );
        });

        // ─── Stat cards ───
        gsap.utils.toArray('[data-animate="stat-card"]').forEach((el, i) => {
          const targetRot = parseFloat(el.dataset.rotation || 0);
          gsap.fromTo(el,
            { y: 80, opacity: 0, rotation: targetRot * 3, scale: 0.8 },
            { y: 0, opacity: 1, rotation: targetRot, scale: 1, duration: 1, delay: i * 0.1, ease: 'back.out(2)',
              scrollTrigger: { trigger: el, start: 'top 90%' } }
          );
        });

        // ─── Footer big text ───
        const footerText = document.querySelector('[data-animate="footer-text"]');
        if (footerText) {
          gsap.fromTo(footerText,
            { y: 150, opacity: 0, scale: 0.9, clipPath: 'inset(100% 0 0 0)' },
            { y: 0, opacity: 1, scale: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.out',
              scrollTrigger: { trigger: footerText, start: 'top 95%' } }
          );
        }

        // ─── Generic fade-up ───
        gsap.utils.toArray('[data-animate="fade"]').forEach((el, i) => {
          gsap.fromTo(el,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: i * 0.05, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%' } }
          );
        });

        ScrollTrigger.refresh();
      });
    };

    initGSAP();

    // Revert all GSAP animations and kill all ScrollTriggers on unmount
    return () => ctx?.revert();
  }, []);

  return null;
}
