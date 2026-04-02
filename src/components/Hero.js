'use client';
import { useRef, useEffect } from 'react';
import styles from './Hero.module.css';
import HeroScrollBtn from './HeroScrollBtn';
import TypewriterSubtitle from './TypewriterSubtitle';
import CountUpStats from './CountUpStats';

const MARQUEE_ROWS = [
  { text: 'DEVELOPER • BACKEND •', dir: 1, angle: -6 },
  { text: 'CLOUD • DEVOPS •', dir: -1, angle: 4 },
  { text: 'REACT • NODE.JS • DOCKER •', dir: 1, angle: -3 },
  { text: 'FULLSTACK • PRISMA • NEXT.JS •', dir: -1, angle: 6 },
  { text: 'TYPESCRIPT • PYTHON • GIT •', dir: 1, angle: -7 },
];

const FLOATS = ['🚀', '⚡', '💻', '🛠️', '🎨', '🌐', '📦'];

function HeroContent({ profile, projects, experiences, titleText, nameParts }) {
  const projectCount = projects?.length || 0;
  const expCount = experiences?.length || 0;

  return (
    <div className={styles.inner}>
      {/* Name Section */}
      <div className={styles.nameBlock}>
        {nameParts.map((part, i) => (
          <span key={i} className={`${styles.nameLine} ${i % 2 !== 0 ? styles.nameOutline : ''}`}>
            {part}
          </span>
        ))}
      </div>

      {/* Subtitle & Stats */}
      <div className={styles.subtitleRow}>
        <div className={styles.subtitleBox}>
          <TypewriterSubtitle text={titleText} />
        </div>
      </div>

      <CountUpStats projects={projectCount} experiences={expCount} />
      
      {/* Scroll Down */}
      <div className={styles.scrollWrapper}>
        <HeroScrollBtn />
      </div>
    </div>
  );
}

function MarqueeBackground() {
  return (
    <div className={styles.marqueeBg} aria-hidden>
      {MARQUEE_ROWS.map((row, i) => (
        <div
          key={i}
          className={styles.marqueeRow}
          style={{ '--angle': `${row.angle}deg` }}
        >
          <div className={`${styles.marqueeTrack} ${styles[`track${i % 2}`]}`}>
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
  const nameParts = (profile?.name || 'Your Name').split(' ');
  const titleText = profile?.title || 'Developer & Creator';

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      
      sectionRef.current.style.setProperty('--mouse-x', `${x}%`);
      sectionRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className={styles.hero} ref={sectionRef}>
      {/* Base Layer */}
      <div className={`${styles.layer} ${styles.baseLayer}`}>
        <MarqueeBackground />
        <HeroContent 
          profile={profile} 
          projects={projects} 
          experiences={experiences} 
          titleText={titleText} 
          nameParts={nameParts}
        />
        <div className={styles.floatLayer}>
          {FLOATS.map((emoji, i) => (
            <span key={i} className={styles.floatEmoji} style={{
              '--fx': `${10 + i * 13}%`, '--fy': `${15 + (i % 3) * 28}%`,
              '--fdelay': `${i * 0.6}s`, '--fdur': `${4 + i * 0.5}s`,
            }}>{emoji}</span>
          ))}
        </div>
      </div>

      {/* Reveal Layer (Flashlight) */}
      <div className={`${styles.layer} ${styles.revealLayer}`} aria-hidden="true">
        <MarqueeBackground />
        <HeroContent 
          profile={profile} 
          projects={projects} 
          experiences={experiences} 
          titleText={titleText} 
          nameParts={nameParts}
        />
      </div>

      <p className={styles.eyebrow}>✦ Available for work ✦</p>
    </section>
  );
}

