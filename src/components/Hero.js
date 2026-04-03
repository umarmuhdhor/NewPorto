'use client';
import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import HeroScrollBtn from './HeroScrollBtn';
import TypewriterSubtitle from './TypewriterSubtitle';
import CountUpStats from './CountUpStats';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FLOATS = ['🚀', '⚡', '💻', '🛠️', '🎨', '🌐', '📦'];

function HeroContent({ profile, projects, experiences, titleText, nameParts, refs }) {
  const projectCount = projects?.length || 0;
  const expCount = experiences?.length || 0;

  return (
    <div className={styles.inner}>
      {/* Name Section */}
      <div className={styles.nameBlock}>
        {nameParts.map((part, i) => (
          <span
            key={i}
            ref={el => refs.nameLines.current[i] = el}
            className={`${styles.nameLine} ${i % 2 !== 0 ? styles.nameOutline : ''}`}
          >
            {part}
          </span>
        ))}
      </div>

      {/* Subtitle & Stats */}
      <div className={styles.subtitleRow}>
        <div className={styles.subtitleBox} ref={refs.subtitleBox}>
          <TypewriterSubtitle text={titleText} delay={1800} />
        </div>
      </div>

      <div ref={refs.stats}>
        <CountUpStats projects={projectCount} experiences={expCount} />
      </div>

      {/* Scroll Down */}
      <div className={styles.scrollWrapper} ref={refs.scrollBtn}>
        <HeroScrollBtn />
      </div>
    </div>
  );
}


function MarqueeBackground() {
  const trackRefs = useRef([]);

  useLayoutEffect(() => {
    const handleMouseMove = (e) => {
      const xPercent = (e.clientX / window.innerWidth) - 0.5;
      trackRefs.current.forEach((track, i) => {
        if (!track) return;
        const speed = (i + 1) * 30;
        gsap.to(track, {
          x: xPercent * speed,
          duration: 1,
          ease: 'power2.out'
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const MARQUEE_ROWS = [
    { text: 'DEVELOPER • BACKEND •', dir: 1, angle: -6 },
    { text: 'CLOUD • DEVOPS •', dir: -1, angle: 4 },
    { text: 'REACT • NODE.JS • DOCKER •', dir: 1, angle: -3 },
    { text: 'FULLSTACK • PRISMA • NEXT.JS •', dir: -1, angle: 6 },
    { text: 'TYPESCRIPT • PYTHON • GIT •', dir: 1, angle: -7 },
  ];

  return (
    <div className={styles.marqueeBg} aria-hidden>
      {MARQUEE_ROWS.map((row, i) => (
        <div
          key={i}
          className={styles.marqueeRow}
          style={{ '--angle': `${row.angle}deg` }}
        >
          <div 
            ref={el => trackRefs.current[i] = el}
            className={`${styles.marqueeTrack} ${styles[`track${i % 2}`]}`}
          >
            {[...Array(6)].map((_, j) => (
              <span key={j} className={styles.marqueeWord}>{row.text}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Hero({ profile, projects, experiences }) {
  const sectionRef = useRef(null);
  const statusBadge = useRef(null);
  const nameLines = useRef([]);
  const subtitleBox = useRef(null);
  const stats = useRef(null);
  const scrollBtn = useRef(null);
  const emojiRefs = useRef([]);
  // Store only THIS section's ScrollTrigger so cleanup is scoped
  const scrollTriggerRef = useRef(null);

  const nameParts = (profile?.name || 'Your Name').split(' ');
  const titleText = profile?.title || 'Developer & Creator';

  const refs = { nameLines, subtitleBox, stats, scrollBtn };

  useLayoutEffect(() => {
    // 1. Intro Animation
    const introTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    introTl
      .to(statusBadge.current, { opacity: 1, y: 0, duration: 1.2, delay: 0.5 })
      .to(nameLines.current, {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.5,
        clearProps: 'transform',
      }, '-=0.8')
      .to(subtitleBox.current, { opacity: 1, scale: 1, duration: 1 }, '-=1')
      .to(stats.current, { opacity: 1, y: 0, duration: 1 }, '-=0.8')
      .to(scrollBtn.current, { opacity: 1, duration: 1 }, '-=0.5');

    // 2. Scroll-Linked Fade — direct style writes batched per frame via scrub:1
    // Avoids calling gsap.set() on every scroll tick (layout-thrash anti-pattern).
    const fadeTargets = [
      ...nameLines.current.filter(Boolean),
      subtitleBox.current,
      stats.current,
    ].filter(Boolean);

    const applyFade = (p) => {
      const opacity = Math.max(0, 1 - p * 1.5);
      const y = -p * 200;
      const scale = 1 + p * 0.2;
      const blur = p * 10;
      fadeTargets.forEach((el) => {
        el.style.opacity = opacity;
        el.style.transform = `translateY(${y}px) scale(${scale})`;
        el.style.filter = `blur(${blur}px)`;
      });
    };

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => applyFade(self.progress),
      onLeaveBack: () => applyFade(0),
    });

    // 3. Interactive Interactions (Magnetic & Physics)
    // Guard: only run on pointer:fine devices (not touch)
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;

    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;

      sectionRef.current.style.setProperty('--mouse-x', `${(mouseX / width) * 100}%`);
      sectionRef.current.style.setProperty('--mouse-y', `${(mouseY / height) * 100}%`);

      if (!isPointerFine) return;

      // Magnetic Name Effect (only active at top of page)
      if (window.scrollY < 300) {
        nameLines.current.forEach((line) => {
          if (!line) return;
          const rect = line.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance < 400) {
            gsap.to(line, {
              x: deltaX * 0.15,
              y: deltaY * 0.15,
              rotationZ: deltaX * 0.02,
              duration: 0.6,
              ease: 'power2.out',
            });
          } else {
            gsap.to(line, { x: 0, y: 0, rotationZ: 0, duration: 1 });
          }
        });
      }

      // Emoji Avoidance Physics
      emojiRefs.current.forEach((emoji) => {
        if (!emoji) return;
        const rect = emoji.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 250) {
          const angle = Math.atan2(deltaY, deltaX);
          gsap.to(emoji, {
            x: Math.cos(angle) * -60,
            y: Math.sin(angle) * -60,
            scale: 1.4,
            rotation: deltaX * 0.1,
            duration: 0.4,
          });
        } else {
          gsap.to(emoji, { x: 0, y: 0, scale: 1, rotation: 0, duration: 1.5 });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      introTl.kill();
      // ✅ Kill ONLY this section's ScrollTrigger — not other sections'
      scrollTriggerRef.current?.kill();
    };
  }, []);

  return (
    <section id="home" className={styles.hero} ref={sectionRef}>
      {/* Premium Status Badge */}
      <div className={styles.statusBadge} ref={statusBadge}>
        <div className={styles.statusDot} />
        <span className={styles.statusText}>Available for Work</span>
      </div>

      {/* Base Layer */}
      <div className={`${styles.layer} ${styles.baseLayer}`}>
        <MarqueeBackground />
        <HeroContent 
          profile={profile} 
          projects={projects} 
          experiences={experiences} 
          titleText={titleText} 
          nameParts={nameParts}
          refs={refs}
        />
        <div className={styles.floatLayer}>
          {FLOATS.map((emoji, i) => (
            <span 
              key={i} 
              ref={el => emojiRefs.current[i] = el}
              className={styles.floatEmoji} 
              style={{
                '--fx': `${12 + i * 14}%`, '--fy': `${18 + (i % 3) * 32}%`,
                '--fdelay': `${i * 0.7}s`, '--fdur': `${6 + i * 1.5}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>

      {/* Reveal Layer (Flashlight) — only visual bg + lightweight name overlay */}
      <div className={`${styles.layer} ${styles.revealLayer}`} aria-hidden="true">
        <MarqueeBackground />
        {/* Gold name clone — lightweight, no TypewriterSubtitle/CountUpStats */}
        <div className={styles.inner}>
          <div className={styles.nameBlock}>
            {nameParts.map((part, i) => (
              <span
                key={i}
                className={`${styles.nameLine} ${i % 2 !== 0 ? styles.nameOutline : ''}`}
              >
                {part}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.floatLayer}>
          {FLOATS.map((emoji, i) => (
            <span
              key={i}
              className={styles.floatEmoji}
              style={{
                '--fx': `${12 + i * 14}%`, '--fy': `${18 + (i % 3) * 32}%`,
                '--fdelay': `${i * 0.7}s`, '--fdur': `${6 + i * 1.5}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
