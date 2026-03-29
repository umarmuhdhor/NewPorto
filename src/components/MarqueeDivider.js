import styles from './MarqueeDivider.module.css';

const REPEAT = 8;

export default function MarqueeDivider({ text = 'SECTION', reverse = false }) {
  const items = Array(REPEAT).fill(text);
  return (
    <div className={styles.band} aria-hidden>
      <div className={`${styles.track} ${reverse ? styles.reverse : ''}`}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className={styles.item}>
            {t}<span>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
