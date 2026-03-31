'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Experience.module.css';

function ExperienceItem({ item, index, openModal }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        // observe relative to the scroll container, not the viewport
        root: el.closest('[data-scroll-container]'),
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      id={`exp-item-${item.id}`}
      className={`${styles.item} ${visible ? styles.itemVisible : ''}`}
      style={{ transitionDelay: `${Math.min(index * 60, 300)}ms` }}
      aria-label={`${item.type === 'experience' ? 'Work' : 'Education'}: ${item.title}`}
    >
      <div className={styles.itemSlot}>
        <span className={`badge ${item.type === 'experience' ? 'badge-experience' : 'badge-education'}`}>
          {item.type}
        </span>
        <div className={styles.itemDates}>
          <span>{item.startDate}</span>
          <span aria-hidden="true">→</span>
          <span>{item.endDate}</span>
        </div>
      </div>
      <h3 className={styles.itemTitle}>{item.title}</h3>
      <p className={styles.itemOrg}>{item.organization}</p>
      <div className={styles.itemDivider} aria-hidden="true" />
      <ul className={styles.bulletList}>
        {(() => {
          const lines = item.description.split('\n').map(l => l.trim()).filter(Boolean);
          let wordCount = 0;
          const previewLines = [];

          for (const line of lines) {
            const lineWords = line.split(/\s+/).filter(Boolean);
            if (wordCount + lineWords.length > 100) {
              const remaining = 100 - wordCount;
              if (remaining > 0) {
                previewLines.push(lineWords.slice(0, remaining).join(' ') + '...');
              } else if (previewLines.length > 0) {
                previewLines[previewLines.length - 1] += '...';
              }
              break;
            } else {
              previewLines.push(line);
              wordCount += lineWords.length;
            }
          }

          return previewLines.map((line, i) =>
            <li key={i}>{line.replace(/^[-•]\s*/, '')}</li>
          );
        })()}
      </ul>
      {(() => {
        let imgs = [];
        try { imgs = JSON.parse(item.images || '[]'); } catch(e){}
        const lines = item.description.split('\n').map(l => l.trim()).filter(Boolean);
        const totalWords = lines.reduce((acc, line) => acc + line.split(/\s+/).filter(Boolean).length, 0);
        const isTruncated = totalWords > 100;

        return (
          <button className={styles.detailsBtn} onClick={() => openModal(item)}>
            {imgs.length > 0 && isTruncated 
              ? `Read more & View Media (${imgs.length})`
              : isTruncated 
                ? 'Read more'
                : imgs.length > 0
                  ? `View Attached Media (${imgs.length})`
                  : 'View Details'}
          </button>
        );
      })()}
    </article>
  );
}

export default function Experience({ experiences }) {
  const scrollRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const touchStartY = useRef(0);
  
  const [modalItem, setModalItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [directionStr, setDirectionStr] = useState('');

  const openModal = (item) => {
    setModalItem(item);
    setCurrentImageIndex(0);
  };
  const closeModal = () => setModalItem(null);

  const expItems = experiences?.filter(e => e.type === 'experience') || [];
  const eduItems = experiences?.filter(e => e.type === 'education') || [];
  const allItems = [...expItems, ...eduItems];

  // ─── Auto-scroll logic ───
  const isPaused = useRef(false);
  const preciseScrollTop = useRef(0);
  const autoScrollRaf = useRef(null);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Sync our precise tracker with initial scroll
    preciseScrollTop.current = el.scrollTop;

    const autoScroll = () => {
      // Only auto-scroll if not paused (not hovered/touched)
      if (!isPaused.current) {
        // Slow constant speed: 0.4 pixels per frame (adjust as needed)
        preciseScrollTop.current += 0.4;
        
        const maxScroll = el.scrollHeight - el.clientHeight;
        
        // If we reach the bottom, optionally loop back to the top or just stop
        if (preciseScrollTop.current >= maxScroll - 1) {
          // Loop back to start. We can make it snap to top for endless feel
          preciseScrollTop.current = 0;
          el.scrollTop = 0;
        } else {
          // Apply sub-pixel scroll (browser will round down/up)
          el.scrollTop = preciseScrollTop.current;
        }
      } else {
        // If paused (manual scroll or hover), sync the precise tracker 
        // with the actual DOM scrollTop so it doesn't jump when unpaused.
        preciseScrollTop.current = el.scrollTop;
      }

      autoScrollRaf.current = requestAnimationFrame(autoScroll);
    };

    // Start auto-scroll
    autoScrollRaf.current = requestAnimationFrame(autoScroll);

    // Event handlers to pause auto-scrolling
    const pauseScroll = () => { isPaused.current = true; };
    const resumeScroll = () => { isPaused.current = false; };
    
    // When actively scrolling by wheel/touch, keep it paused
    const handleScroll = () => {
      pauseScroll();
      clearTimeout(scrollTimeout.current);
      // Resume 1.5s after the last scroll event finishes
      scrollTimeout.current = setTimeout(resumeScroll, 1500);
    };

    el.addEventListener('mouseenter', pauseScroll);
    el.addEventListener('mouseleave', resumeScroll);
    el.addEventListener('touchstart', pauseScroll, { passive: true });
    el.addEventListener('touchend', () => {
      // Touch release should delay resume slightly
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(resumeScroll, 1500);
    });
    el.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(autoScrollRaf.current);
      clearTimeout(scrollTimeout.current);
      el.removeEventListener('mouseenter', pauseScroll);
      el.removeEventListener('mouseleave', resumeScroll);
      el.removeEventListener('touchstart', pauseScroll);
      el.removeEventListener('touchend', resumeScroll);
      el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Track which item is most visible in the scroll container → highlight nav dot
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !allItems.length) return;

    const items = Array.from(container.querySelectorAll('[id^="exp-item-"]'));
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        let bestRatio = 0;
        entries.forEach(e => {
          if (e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio;
            best = e.target.id.replace('exp-item-', '');
          }
        });
        if (best) setActiveId(best);
      },
      { root: container, threshold: [0.3, 0.6, 0.9] }
    );

    items.forEach(el => observer.observe(el));
    if (allItems[0]) setActiveId(String(allItems[0].id));

    return () => observer.disconnect();
  }, [experiences]);

  const scrollToItem = (id) => {
    const el = document.getElementById(`exp-item-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <section id="experience" className={`section ${styles.section}`}>
      <div className="container">
        <p className="section-subheading">// BACKGROUND</p>
        <h2 className="section-heading">Experience &amp; Education</h2>

        <div className={styles.layout}>
          {/* Sticky navigation panel */}
          <nav className={styles.nav} aria-label="Experience navigation">
            {expItems.length > 0 && (
              <>
                <p className={styles.navGroup}>Work</p>
                {expItems.map((item, i) => (
                  <button
                    key={item.id}
                    className={`${styles.navItem} ${String(activeId) === String(item.id) ? styles.navItemActive : ''}`}
                    onClick={() => scrollToItem(item.id)}
                    aria-current={String(activeId) === String(item.id) ? 'true' : undefined}
                  >
                    <span className={styles.navDot} aria-hidden="true" />
                    <span className={styles.navNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.navTitle}>{item.title}</span>
                  </button>
                ))}
              </>
            )}
            {eduItems.length > 0 && (
              <>
                <p className={styles.navGroup}>Education</p>
                {eduItems.map((item, i) => (
                  <button
                    key={item.id}
                    className={`${styles.navItem} ${String(activeId) === String(item.id) ? styles.navItemActive : ''}`}
                    onClick={() => scrollToItem(item.id)}
                    aria-current={String(activeId) === String(item.id) ? 'true' : undefined}
                  >
                    <span className={styles.navDot} aria-hidden="true" />
                    <span className={styles.navNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.navTitle}>{item.title}</span>
                  </button>
                ))}
              </>
            )}
          </nav>

          {/* Scroll-isolated feed — data-lenis-prevent tells Lenis to skip this element */}
          <div
            ref={scrollRef}
            data-scroll-container
            data-lenis-prevent
            className={styles.feed}
            role="feed"
            aria-label="Experience and education items"
          >
            {allItems.map((item, i) => (
              <ExperienceItem key={item.id} item={item} index={i} openModal={openModal} />
            ))}
          </div>
        </div>
      </div>

      {modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{modalItem.title}</h3>
              <button className={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.modalBody} data-lenis-prevent>
              <div className={styles.modalDescription}>
                <ul className={styles.bulletList}>
                  {modalItem.description.split('\n').map((line, i) =>
                    line.trim() ? <li key={i}>{line.replace(/^[-•]\s*/, '')}</li> : null
                  )}
                </ul>
              </div>
              {(() => {
                let imgs = [];
                try { imgs = JSON.parse(modalItem.images || '[]'); } catch(e){}
                if (imgs.length === 0) return null;
                return (
                  <div className={styles.carousel}>
                    {imgs.length > 1 && (
                      <button className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`} onClick={() => {
                        setDirectionStr(styles.slidePrev);
                        setCurrentImageIndex(i => i === 0 ? imgs.length - 1 : i - 1);
                      }}>
                        ←
                      </button>
                    )}
                    <img key={`${currentImageIndex}-${directionStr}`} src={imgs[currentImageIndex]} alt="carousel item" className={`${styles.carouselImage} ${directionStr || ''}`} />
                    {imgs.length > 1 && (
                      <button className={`${styles.carouselBtn} ${styles.carouselBtnNext}`} onClick={() => {
                        setDirectionStr(styles.slideNext);
                        setCurrentImageIndex(i => i === imgs.length - 1 ? 0 : i + 1);
                      }}>
                        →
                      </button>
                    )}
                    {imgs.length > 1 && (
                      <div className={styles.carouselIndicators}>
                        {imgs.map((_, idx) => (
                          <button key={idx} onClick={() => {
                            setDirectionStr(idx > currentImageIndex ? styles.slideNext : styles.slidePrev);
                            setCurrentImageIndex(idx);
                          }} className={`${styles.indicator} ${idx === currentImageIndex ? styles.indicatorActive : ''}`} aria-label={`Go to slide ${idx + 1}`} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
