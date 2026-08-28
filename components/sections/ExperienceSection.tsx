'use client';

import { useRef } from 'react';
import { motion, useScroll, useInView } from 'motion/react';
import { Briefcase, Calendar, CheckCircle2, Building, ChevronRight } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Experience } from '@/types/portfolio';

interface ExperienceSectionProps {
  experience?: Experience[];
  isLoading: boolean;
}

function ExperienceItem({ exp }: { exp: Experience }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { margin: '0px 0px -35% 0px', once: false });
  const isHighlighted = isInView || exp.isCurrent;

  return (
    <div ref={itemRef} className="timeline-item-wrapper">
      {/* Concentric Double Circle Milestone Node */}
      <div
        className={`timeline-node ${isHighlighted ? 'timeline-node-active' : ''}`}
        style={{
          border: isHighlighted ? '2px solid var(--accent)' : '2px solid var(--border-strong)',
        }}
      >
        <div
          className="timeline-node-inner"
          style={{
            backgroundColor: isHighlighted ? 'var(--accent)' : 'var(--border-strong)',
          }}
        />
      </div>

      {/* Experience Card */}
      <div className="bezel-card bezel-card-interactive" style={{ width: '100%', minWidth: 0 }}>
        <div className="bezel-core">
          
          {/* Responsive Role Header */}
          <div className="experience-card-header">
            <div className="experience-header-meta">
              {exp.isCurrent && (
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  <CheckCircle2 size={11} strokeWidth={2} /> Current Role
                </span>
              )}
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--fg-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Calendar size={11} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
                <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
              </span>
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <h3
                style={{
                  fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)',
                  fontWeight: 700,
                  color: 'var(--fg)',
                  marginBottom: '0.35rem',
                  letterSpacing: '-0.015em',
                  lineHeight: 1.3,
                }}
              >
                {exp.title}
              </h3>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                <Building size={14} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                <span>{exp.organization}</span>
              </p>
            </div>
          </div>

          {/* Elevated Structured Bullet Points */}
          {exp.bullets && exp.bullets.length > 0 && (
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                margin: 0,
                padding: 0,
              }}
            >
              {exp.bullets.map((bullet, bIdx) => (
                <li
                  key={bIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    fontSize: '0.875rem',
                    color: 'var(--fg-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--accent-subtle)',
                      border: '1px solid var(--accent-border)',
                      color: 'var(--accent)',
                      marginTop: '3px',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronRight size={11} strokeWidth={2.5} />
                  </span>
                  <span style={{ flex: 1 }}>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </div>
  );
}

export function ExperienceSection({ experience = [], isLoading }: ExperienceSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 35%'],
  });

  return (
    <section id="experience" className="section bg-grid-pattern" aria-label="Professional Experience">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <SectionBadge icon={<Briefcase size={13} strokeWidth={1.75} />}>
            Leadership & Career
          </SectionBadge>
          <h2 className="section-title">Work & Leadership Experience</h2>
          <p className="section-description">
            Hands-on track record in social research, event operations, student organization administration, and youth empowerment.
          </p>
        </div>

        {/* Lag-Free Responsive Scroll-Follow Timeline */}
        <div ref={containerRef} className="timeline-container">
          
          {/* Static Background Vertical Track Line */}
          <div className="timeline-track-static" />

          {/* Crisp Scroll-Follow Progress Line (No Glow) */}
          <motion.div
            className="timeline-track-progress"
            style={{
              scaleY: scrollYProgress,
              transformOrigin: 'top',
              willChange: 'transform',
            }}
          />

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="timeline-item-wrapper">
                <div className="skeleton" style={{ height: '150px', borderRadius: 'var(--radius-outer)', width: '100%' }} />
              </div>
            ))
          ) : (
            experience.map((exp) => (
              <ExperienceItem key={exp._id} exp={exp} />
            ))
          )}
        </div>

      </div>

      <style>{`
        .timeline-container {
          position: relative;
          padding-left: 2.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          width: 100%;
        }

        .timeline-item-wrapper {
          position: relative;
          width: 100%;
        }

        .timeline-track-static {
          position: absolute;
          left: 9px;
          top: 34px;
          bottom: 40px;
          width: 2px;
          background-color: var(--border);
          border-radius: 2px;
        }

        .timeline-track-progress {
          position: absolute;
          left: 9px;
          top: 34px;
          bottom: 40px;
          width: 2px;
          background-color: var(--accent);
          border-radius: 2px;
        }

        .timeline-node {
          position: absolute;
          left: -2.75rem;
          top: 24px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: border-color 0.25s ease;
        }

        .timeline-node-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: background-color 0.25s ease;
        }

        .experience-card-header {
          display: flex;
          flex-direction: column-reverse;
          gap: 0.65rem;
          margin-bottom: 1rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--border);
        }

        .experience-header-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        @media (min-width: 640px) {
          .experience-card-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
          }
          .experience-card-header > div:last-child {
            order: 1;
          }
          .experience-header-meta {
            order: 2;
          }
        }

        @media (max-width: 640px) {
          .timeline-container {
            padding-left: 2rem;
            gap: 1.25rem;
          }

          .timeline-track-static,
          .timeline-track-progress {
            left: 7px;
            top: 28px;
            bottom: 30px;
          }

          .timeline-node {
            left: -2rem;
            top: 20px;
            width: 16px;
            height: 16px;
          }

          .timeline-node-inner {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>
    </section>
  );
}
