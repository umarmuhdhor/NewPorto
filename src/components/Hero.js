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

export default function Hero({ profile, projects, experiences }) {
  const nameParts = (profile?.name || 'Your Name').split(' ');
  const projectCount = projects?.length || 0;
  const expCount = experiences?.length || 0;
  const titleText = profile?.title || 'Developer & Creator';

  return (
    <section id="home" className={styles.hero}>
      {/* Diagonal marquee background */}
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

      {/* Floating emoji */}
      <div className={styles.floatLayer} aria-hidden>
        {FLOATS.map((emoji, i) => (
          <span
            key={i}
            className={styles.floatEmoji}
            style={{
              '--fx': `${10 + i * 13}%`,
              '--fy': `${15 + (i % 3) * 28}%`,
              '--fdelay': `${i * 0.6}s`,
              '--fdur': `${4 + i * 0.5}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className={styles.inner} data-animate="hero-inner">
        <p className={styles.eyebrow}>✦ Available for work ✦</p>

        <div className={styles.nameBlock}>
          {nameParts.map((part, i) => (
            <span key={i} className={`${styles.nameLine} ${i % 2 !== 0 ? styles.nameOutline : ''}`}>
              {part}
            </span>
          ))}
        </div>

        <div className={styles.subtitleRow}>
          <div className={styles.subtitleBox}>
            <TypewriterSubtitle text={titleText} />
          </div>
        </div>

        {/* Count-up stats */}
        <CountUpStats projects={projectCount} experiences={expCount} />

        <HeroScrollBtn />
      </div>
    </section>
  );
}
