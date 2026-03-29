import styles from './Footer.module.css';

export default function Footer({ profile, socialLinks }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className="container">
          <div className={styles.inner}>
            <div className={styles.left}>
              <p className={styles.label}>// LET'S CONNECT</p>
              <h2 className={styles.bigText} data-animate="footer-text">GET IN<br />TOUCH.</h2>
              {socialLinks?.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                  className={styles.socialLink}>
                  <span className={styles.socialPlatform}>{s.platform}</span>
                  <span className={styles.socialArrow}>↗</span>
                </a>
              ))}
            </div>

            <div className={styles.right}>
              <div className={styles.bioCard}>
                <p className={styles.bioLabel}>Who is {profile?.name?.split(' ')[0] || 'this'}?</p>
                <p className={styles.bioText}>
                  {profile?.title || 'Developer & Creator'} who loves building things on the internet. Always open to new opportunities and collaborations.
                </p>
                <div className={styles.stack}>
                  <p className={styles.stackLabel}>Built with</p>
                  <div className={styles.stackBadges}>
                    <span className={styles.stackBadge}>Next.js</span>
                    <span className={styles.stackBadge}>Prisma</span>
                    <span className={styles.stackBadge}>SQLite</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.copy}>© {year} {profile?.name || 'Portfolio'}. All rights reserved.</p>
          <a href="/admin" className={styles.adminLink}>Admin Panel →</a>
        </div>
      </div>
    </footer>
  );
}
