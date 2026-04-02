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
        // ─── Hero Entrance & Premium Parallax ───
        const heroInner = document.querySelector('[data-animate="hero-inner"]');
        if (heroInner) {
          const entranceAnim = gsap.fromTo(heroInner,
            { opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' },
            { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.8, ease: 'expo.out', delay: 0.8 }
          );
          entranceAnim.eventCallback('onComplete', () => {
            gsap.to(heroInner, {
              y: 350, opacity: 0, filter: 'blur(15px)', ease: 'none',
              scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
            });
          });
        }

        // ─── Hero Marquee Scroll Scrubbing ───
        gsap.utils.toArray('[class*="Hero_marqueeRow"]').forEach((row, i) => {
          gsap.to(row, {
            x: i % 2 === 0 ? '-20vw' : '20vw', ease: 'none',
            scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1.5 }
          });
        });

        // ─── Section Headings — Cinematic Wipe & Stagger ───
        gsap.utils.toArray('.section-heading').forEach((el) => {
          gsap.fromTo(el,
            { clipPath: 'inset(100% 0 0 0)', y: 100, filter: 'blur(12px)', opacity: 0 },
            { 
              clipPath: 'inset(0% 0 0 0)', y: 0, filter: 'blur(0px)', opacity: 1, 
              duration: 1.6, ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 88%' } 
            }
          );
        });

        // ─── Section Subheadings — Smooth Glide ───
        gsap.utils.toArray('.section-subheading').forEach((el) => {
          gsap.fromTo(el,
            { y: 40, opacity: 0, letterSpacing: '0.4em' },
            { 
              y: 0, opacity: 1, letterSpacing: '0.18em', 
              duration: 1.2, ease: 'power4.out',
              scrollTrigger: { trigger: el, start: 'top 92%' } 
            }
          );
        });

        // ─── Project Cards — Smooth Elastic Pop ───
        gsap.utils.toArray('[data-animate="card"]').forEach((el, i) => {
          gsap.fromTo(el,
            { y: 150, opacity: 0, rotation: i % 2 === 0 ? -10 : 10, scale: 0.75 },
            {
              y: 0, opacity: 1, rotation: 0, scale: 1,
              duration: 1.4, delay: i * 0.15, ease: 'elastic.out(1, 0.75)',
              scrollTrigger: { trigger: el, start: 'top 90%' },
              onComplete: () => {
                // Keep the neobrutalist rotation active but gentle
                gsap.set(el, { rotation: i % 2 === 0 ? 1.5 : -1 });
              }
            }
          );
        });

        // ─── Experience Tabs / About Lines — Staggered Reveal ───
        gsap.utils.toArray('[data-animate="tab"]').forEach((el, i) => {
          gsap.fromTo(el,
            { x: -60, opacity: 0, filter: 'blur(4px)' },
            { 
              x: 0, opacity: 1, filter: 'blur(0px)', 
              duration: 1, delay: i * 0.12, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 92%' } 
            }
          );
        });

        // ─── Stat Cards — Bounce Entrance ───
        gsap.utils.toArray('[data-animate="stat-card"]').forEach((el, i) => {
          const targetRot = parseFloat(el.dataset.rotation || 0);
          gsap.fromTo(el,
            { y: 100, opacity: 0, rotation: targetRot * 4, scale: 0.6 },
            { 
              y: 0, opacity: 1, rotation: targetRot, scale: 1, 
              duration: 1.3, delay: i * 0.15, ease: 'back.out(2)',
              scrollTrigger: { trigger: el, start: 'top 95%' } 
            }
          );
        });

        // ─── Footer Big Text — Dramatic Scale Reveal ───
        const footerText = document.querySelector('[data-animate="footer-text"]');
        if (footerText) {
          gsap.fromTo(footerText,
            { y: clamp(200, 30, 'vh'), opacity: 0, scale: 0.8, filter: 'blur(20px)' },
            { 
              y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', 
              duration: 2, ease: 'expo.out',
              scrollTrigger: { trigger: footerText, start: 'top 98%' } 
            }
          );
        }

        // ─── Generic Fade-up for misc elements ───
        gsap.utils.toArray('[data-animate="fade"]').forEach((el, i) => {
          gsap.fromTo(el,
            { y: 60, opacity: 0, filter: 'blur(5px)' },
            { 
              y: 0, opacity: 1, filter: 'blur(0px)', 
              duration: 1.2, delay: i * 0.1, ease: 'power4.out',
              scrollTrigger: { trigger: el, start: 'top 95%' } 
            }
          );
        });

        ScrollTrigger.refresh();
      });
    };

    const clamp = (val, min, unit) => `clamp(${min}${unit}, ${val}px, ${val}px)`;

    initGSAP();

    return () => ctx?.revert();
  }, []);

  return null;
}

