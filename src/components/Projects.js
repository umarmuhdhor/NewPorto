'use client';
import { useRef, useState, useEffect } from 'react';
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
            <TiltCard key={project.id} className={`${styles.card} ${styles[`card${i % 3}`]}`} data-animate="card">
              {/* Image */}
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
                {/* Overlay on hover */}
                <div 
                  className={styles.imageOverlay} 
                  onClick={() => setSelectedProject(project)}
                >
                  <span className={styles.overlayText}>VIEW PROJECT</span>
                </div>
              </div>

              {/* Body */}
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
                    VIEW DETAILS
                  </button>
                  <div className={styles.actionsRow}>
                    {project.codeUrl && (
                      <a href={project.codeUrl} target="_blank" rel="noopener noreferrer"
                        className={`btn-secondary ${styles.actionBtn}`}>
                        CODE
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className={`btn-primary ${styles.actionBtn}`} style={{ background: 'var(--accent-green)', color: 'var(--black)' }}>
                        LIVE ↗
                      </a>
                    )}
                  </div>
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

        {/* Modal Overlay */}
        {selectedProject && (
          <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setSelectedProject(null)}>✕</button>
              
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>{selectedProject.title}</h3>
                <div className={styles.meta} style={{ marginBottom: 0 }}>
                  <span className={styles.role}>{selectedProject.role}</span>
                  <span className={styles.date}>{selectedProject.date}</span>
                </div>
              </div>

              {selectedProject.imageUrl && (
                <div className={styles.modalImageWrap}>
                  <img src={selectedProject.imageUrl} alt={selectedProject.title} className={styles.modalImage} />
                </div>
              )}

              <div className={styles.modalBody}>
                <div className={styles.modalSection}>
                  <span className={styles.modalSectionTitle}>Overview</span>
                  <p className={styles.modalText}>{selectedProject.description}</p>
                </div>

                {selectedProject.backstory && (
                  <div className={styles.modalSection}>
                    <span className={styles.modalSectionTitle}>Backstory</span>
                    <p className={styles.modalText}>{selectedProject.backstory}</p>
                  </div>
                )}

                {selectedProject.flow && (
                  <div className={styles.modalSection}>
                    <span className={styles.modalSectionTitle}>Alur / Flow</span>
                    <p className={styles.modalText}>{selectedProject.flow}</p>
                  </div>
                )}

                <div className={styles.modalActions}>
                  {selectedProject.codeUrl && (
                    <a href={selectedProject.codeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                      CODE
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      LIVE ↗
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
