'use client';
import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Tools.module.css';

const TOOL_ICONS = {
  javascript: '🟨', typescript: '🔷', python: '🐍', react: '⚛️', 'next.js': '▲',
  'node.js': '🟩', postgresql: '🐘', docker: '🐳', git: '📦', figma: '🎨',
  aws: '☁️', prisma: '◆', golang: '🔵', kubernetes: '⎈', terraform: '🏗️',
  mongodb: '🍃', redis: '🔴', graphql: '◉', vue: '💚', angular: '🔴',
  mysql: '🐬', linux: '🐧', nginx: '🔶', tailwind: '🌊', flutter: '💙',
  html: '🧡', css: '💙', github: '🐙', vscode: '🖥️', vercel: '▲',
};

function getIcon(name) {
  return TOOL_ICONS[name.toLowerCase()] || '⚙️';
}

function getCardColor(name, idx) {
  const colors = [
    '#fff8e1', '#e8f5e9', '#e3f2fd', '#fce4ec', '#f3e5f5',
    '#e0f7fa', '#fff3e0', '#e8eaf6', '#e0f2f1', '#fbe9e7',
  ];
  return colors[(name.charCodeAt(0) + idx) % colors.length];
}

function MagneticToolCard({ tool, idx, isReverse }) {
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const icon = iconRef.current;
    if (!card || !icon) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Move icon 30% of the distance to the cursor (magnetic effect)
    gsap.to(icon, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    const icon = iconRef.current;
    if (!icon) return;
    gsap.to(icon, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <div 
      ref={cardRef}
      className={styles.stripCard} 
      style={{ '--bg': getCardColor(tool.name, idx) }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={iconRef} className={styles.stripIcon}>
        {tool.iconUrl
          ? <img src={tool.iconUrl} alt={tool.name} className={styles.iconImg} />
          : getIcon(tool.name)
        }
      </span>
      <span className={styles.stripName}>{tool.name}</span>
    </div>
  );
}

export default function Tools({ tools }) {
  const allTools = tools || [];
  const half = Math.ceil(allTools.length / 2);
  const strip1 = allTools.slice(0, half);
  const strip2 = allTools.slice(half);

  return (
    <section id="tools" className={`section ${styles.section}`}>
      <div className="container">
        <p className="section-subheading">// TECH STACK</p>
        <div className={styles.headingRow}>
          <h2 className={`section-heading ${styles.heading}`}>
            SKILLS &amp; <span className={styles.headingOutline}>TOOLS</span>
          </h2>
          <p className={styles.count}>{allTools.length}<span className={styles.countLabel}>total</span></p>
        </div>
      </div>

      <div className={styles.stripWrapper}>
        {/* Strip 1 — Marquee Left */}
        <div className={styles.strip}>
          <div className={styles.stripTrack}>
            {[...strip1, ...strip1].map((tool, i) => (
              <MagneticToolCard key={`s1-${i}`} tool={tool} idx={i} />
            ))}
          </div>
        </div>

        {/* Strip 2 — Marquee Right */}
        <div className={styles.strip}>
          <div className={`${styles.stripTrack} ${styles.stripReverse}`}>
            {[...strip2, ...strip2].map((tool, i) => (
              <MagneticToolCard key={`s2-${i}`} tool={tool} idx={i + 5} isReverse />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

