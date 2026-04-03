'use client';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Experience.module.css';

function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  // Handle both 'YYYY-MM-DD' and 'YYYY' formats consistently
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function TimelineItem({ item, index, openModal }) {
  const [mounted, setMounted] = useState(false);
  const itemRef = useRef(null);
  const nodeRef = useRef(null);
  const cardRef = useRef(null);
  const connectorRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const isEven = index % 2 === 0;

    // Node animation
    gsap.fromTo(nodeRef.current,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.6,
        scrollTrigger: {
          trigger: nodeRef.current,
          start: 'top 85%',
          toggleClass: styles.nodeActive,
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Card animation
    gsap.fromTo(cardRef.current,
      { 
        x: isEven ? -100 : 100, 
        opacity: 0, 
        scale: 0.9,
        filter: 'blur(10px)'
      },
      {
        x: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
        duration: 1.2, ease: 'expo.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Connector animation
    gsap.fromTo(connectorRef.current,
      { width: 0, opacity: 0 },
      { 
        width: '6%', opacity: 1, duration: 0.8, delay: 0.2,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%'
        }
      }
    );
  }, [index]);

  return (
    <div ref={itemRef} className={styles.itemWrapper}>
      <div ref={nodeRef} className={styles.node} aria-hidden="true" />
      <div ref={connectorRef} className={styles.itemConnector} aria-hidden="true" />
      
      <article
        ref={cardRef}
        className={styles.item}
      >
        <div className={styles.itemSlot}>
          <span className={`badge ${item.type === 'experience' ? 'badge-experience' : 'badge-education'}`}>
            {item.type}
          </span>
          <div className={styles.itemDates}>
            {mounted && (
              <span>{formatDate(item.startDate)} — {formatDate(item.endDate)}</span>
            )}
          </div>
        </div>
        <h3 className={styles.itemTitle}>{item.title}</h3>
        <p className={styles.itemOrg}>{item.organization}</p>
        <div className={styles.itemDivider} aria-hidden="true" />
        
        {/* Render description as clean bullets */}
        <ul className={styles.bulletList}>
          {item.description.split('\n').filter(Boolean).slice(0, 3).map((line, i) => (
            <li key={i}>{line.replace(/^[-•]\s*/, '').trim()}</li>
          ))}
        </ul>

        <button className={styles.detailsBtn} onClick={() => openModal(item)}>
          VIEW DETAILS &rarr;
        </button>
      </article>
    </div>
  );
}

export default function Experience({ experiences }) {
  const [modalItem, setModalItem] = useState(null);
  const timelineRef = useRef(null);
  const lineProgressRef = useRef(null);

  const openModal = (item) => setModalItem(item);
  const closeModal = () => setModalItem(null);

  const allItems = [
    ...(experiences?.filter(e => e.type === 'experience') || []),
    ...(experiences?.filter(e => e.type === 'education') || [])
  ].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  useLayoutEffect(() => {
    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    // Animate the main timeline line drawing
    gsap.fromTo(lineProgressRef.current,
      { height: 0 },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          end: 'bottom 80%',
          scrub: true
        }
      }
    );
  }, []);

  return (
    <section id="experience" className={`section ${styles.section}`}>
      <div className="container">
        <p className="section-subheading">{'// CAREER PATH'}</p>
        <h2 className="section-heading">MIL<span className={styles.headingOutline}>ESTONES</span></h2>

        <div className={styles.timeline} ref={timelineRef}>
          <div className={styles.timelineTrack} />
          <div ref={lineProgressRef} className={styles.timelineLine} />
          
          {allItems.map((item, i) => (
            <TimelineItem 
              key={item.id} 
              item={item} 
              index={i} 
              openModal={openModal} 
            />
          ))}
        </div>
      </div>

      {/* Media Modal */}
      {modalItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{modalItem.title}</h3>
              <button className={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalDescription}>
                <ul className={styles.bulletList}>
                  {modalItem.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i}>{line.replace(/^[-•]\s*/, '').trim()}</li>
                  ))}
                </ul>
              </div>
              {/* Image handling if needed */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

