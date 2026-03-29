'use client';
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

// Generate static color from tool name
function getCardColor(name, idx) {
  const colors = [
    '#fff8e1', '#e8f5e9', '#e3f2fd', '#fce4ec', '#f3e5f5',
    '#e0f7fa', '#fff3e0', '#e8eaf6', '#e0f2f1', '#fbe9e7',
  ];
  return colors[(name.charCodeAt(0) + idx) % colors.length];
}

export default function Tools({ tools }) {
  const categories = [...new Set(tools?.map(t => t.category) || [])];

  // Split all tools into 2 strips for marquee effect
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
            TOOLS &amp; <span className={styles.headingOutline}>LANGUAGES</span>
          </h2>
          <p className={styles.count}>{allTools.length}<span className={styles.countLabel}>skills</span></p>
        </div>
      </div>

      {/* ── Infinite scrolling strips ── */}
      <div className={styles.stripWrapper}>
        {/* Strip 1 — left to right */}
        <div className={styles.strip}>
          <div className={styles.stripTrack}>
            {[...strip1, ...strip1].map((tool, i) => (
              <div key={`s1-${i}`} className={styles.stripCard} style={{ '--bg': getCardColor(tool.name, i) }}>
                <span className={styles.stripIcon}>
                  {tool.iconUrl
                    ? <img src={tool.iconUrl} alt={tool.name} className={styles.iconImg} />
                    : getIcon(tool.name)
                  }
                </span>
                <span className={styles.stripName}>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strip 2 — right to left */}
        <div className={styles.strip}>
          <div className={`${styles.stripTrack} ${styles.stripReverse}`}>
            {[...strip2, ...strip2].map((tool, i) => (
              <div key={`s2-${i}`} className={styles.stripCard} style={{ '--bg': getCardColor(tool.name, i + 5) }}>
                <span className={styles.stripIcon}>
                  {tool.iconUrl
                    ? <img src={tool.iconUrl} alt={tool.name} className={styles.iconImg} />
                    : getIcon(tool.name)
                  }
                </span>
                <span className={styles.stripName}>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
