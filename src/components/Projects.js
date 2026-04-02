'use client';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Projects.module.css';

function TiltCard({ children, className, ...props }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
  };

  return (
    <article
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </article>
  );
}

export default function Projects({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Close modal on esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  // GSAP animation for modal
  useLayoutEffect(() => {
    if (selectedProject && modalRef.current && contentRef.current) {
      gsap.fromTo(modalRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(contentRef.current,
        { scale: 0.9, y: 40, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'back.out(1.7)' }
      );
    }
  }, [selectedProject]);

  const parseFlow = (flow) => {
    if (!flow) return [];
    return flow.split(/\n|(?<=\.) /).filter(s => s.trim().length > 0);
  };

  return (
    <section id="projects" className={`section ${styles.section}`}>
      <div className="container">
        <p className="section-subheading">{'// WHAT I\'VE BUILT'}</p>
        <div className={styles.headingRow}>
          <h2 className={`section-heading ${styles.heading}`}>
            PROJ<span className={styles.headingOutline}>ECTS</span>
          </h2>
          <p className={styles.tagline}>BACKEND &amp; FRONTEND ENGINEERING</p>
        </div>

        <div className={styles.grid}>
          {projects?.map((project, i) => (
            <TiltCard 
              key={project.id} 
              className={`${styles.card} ${styles[`card${i % 3}`]}`} 
              data-animate="card"
              data-cursor="VIEW"
            >
              <div className={styles.imageWrap}>
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className={styles.image} />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <span>🖥️</span>
                  </div>
                )}
                <span className={`badge ${project.status === 'Active' ? 'badge-active' : 'badge-completed'} ${styles.statusBadge}`}>
                  {project.status === 'Active' && <span className={styles.dot} />}
                  {project.status}
                </span>
                <div 
                  className={styles.imageOverlay} 
                  onClick={() => setSelectedProject(project)}
                  data-cursor="VIEW"
                >
                  <span className={styles.overlayText}>VIEW CASE STUDY</span>
                </div>
              </div>


              <div className={styles.body}>
                <div className={styles.meta}>
                  {project.role && <span className={styles.role}>{project.role}</span>}
                  {project.date && <span className={styles.date}>{project.date}</span>}
                </div>
                <h3 className={styles.title}>{project.title}</h3>
                {project.subtitle && <p className={styles.subtitle}>{project.subtitle}</p>}
                <p className={styles.desc}>{project.description}</p>

                {project.techStack && (
                  <div className={styles.techStack}>
                    {project.techStack.split(',').map((tech, idx) => (
                      <span key={idx} className={styles.techBadge}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.actions}>
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className={`btn-secondary ${styles.actionBtn} ${styles.btnDetail}`}>
                    READ CASE STUDY &rarr;
                  </button>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {(!projects || projects.length === 0) && (
          <div className={styles.empty}>
            <p>No projects yet. Add some via the admin panel!</p>
          </div>
        )}

        {/* Modal Overlay 2.0 */}
        {selectedProject && (
          <div className={styles.modalOverlay} ref={modalRef} onClick={() => setSelectedProject(null)}>
            <div className={styles.modalContent} ref={contentRef} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setSelectedProject(null)}>✕</button>
              
              {/* Left Panel: Hero */}
              <div className={styles.modalHeroPanel}>
                {selectedProject.imageUrl ? (
                  <img src={selectedProject.imageUrl} alt={selectedProject.title} className={styles.modalHeroImage} />
                ) : (
                  <div className={styles.imagePlaceholder} style={{ background: 'var(--black)', height: '100%' }}>
                    <span>⚡</span>
                  </div>
                )}
                <div className={styles.modalHeroBottom}>
                  <div className={styles.modalMetaRow}>
                    <div className={styles.modalMetaItem}>
                      <span className={styles.metaLabel}>Role</span>
                      <span className={styles.metaValue}>{selectedProject.role || 'Developer'}</span>
                    </div>
                    <div className={styles.modalMetaItem}>
                      <span className={styles.metaLabel}>Date</span>
                      <span className={styles.metaValue}>{selectedProject.date || 'Present'}</span>
                    </div>
                  </div>
                  <div className={styles.techStack} style={{ marginBottom: 0 }}>
                    {selectedProject.techStack?.split(',').map((tech, idx) => (
                      <span key={idx} className={styles.techBadge} style={{ background: 'var(--white)' }}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel: Content */}
              <div className={styles.modalInfoPanel}>
                <div className={styles.modalHeaderInfo}>
                  <h3 className={styles.modalTitle}>{selectedProject.title}</h3>
                  <p className={styles.modalOverview}>{selectedProject.description}</p>
                </div>

                {selectedProject.backstory && (
                  <div className={styles.modalSection}>
                    <span className={styles.modalSectionTag}>Backstory</span>
                    <p className={styles.modalText}>{selectedProject.backstory}</p>
                  </div>
                )}

                {selectedProject.flow && (
                  <div className={styles.modalSection}>
                    <span className={styles.modalSectionTag}>Project Journey / Flow</span>
                    <div className={styles.flowContainer}>
                      {parseFlow(selectedProject.flow).map((step, idx) => (
                        <div key={idx} className={styles.flowStep}>
                          <span className={styles.stepNum}>{String(idx + 1).padStart(2, '0')}</span>
                          <p className={styles.stepText}>{step.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.modalActions}>
                  {selectedProject.codeUrl && (
                    <a href={selectedProject.codeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                      SOURCE CODE &lt;/&gt;
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                      LAUNCH APP ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

