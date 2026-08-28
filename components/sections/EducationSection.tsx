'use client';

import { useRef } from 'react';
import { motion, useScroll, useInView } from 'motion/react';
import { GraduationCap, Calendar, Award, Building2 } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Education, Profile } from '@/types/portfolio';

interface EducationSectionProps {
  education?: Education[];
  profile?: Profile;
  isLoading: boolean;
}

function EducationItem({ edu }: { edu: Education }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { margin: '0px 0px -35% 0px', once: false });
  const isHighlighted = isInView || edu.isCurrent;

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

      {/* Education Card */}
      <div className="bezel-card bezel-card-interactive" style={{ width: '100%', minWidth: 0 }}>
        <div className="bezel-core">
          
          <div className="education-card-header">
            {edu.isCurrent && (
              <div className="education-header-meta">
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  Currently Enrolled
                </span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
              <GraduationCap size={18} strokeWidth={1.75} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <h3 style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)', fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.015em', lineHeight: 1.3 }}>
                {edu.degree}
              </h3>
            </div>
          </div>

          <p style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.85rem', flexWrap: 'wrap', lineHeight: 1.4 }}>
            <Building2 size={14} strokeWidth={1.75} style={{ flexShrink: 0 }} />
            <span>{edu.institution}</span>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.785rem', color: 'var(--fg-muted)', fontWeight: 500 }}>
              <Calendar size={12} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
              <span>{edu.startDate}{edu.isCurrent ? ' – Present' : edu.endDate ? ` – ${edu.endDate}` : ''}</span>
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.785rem',
                color: 'var(--accent)',
                fontWeight: 600,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
              }}
            >
              <Award size={12} strokeWidth={1.75} />
              <span>{edu.result}</span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export function EducationSection({ education = [], profile, isLoading }: EducationSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const eduConfig = profile?.educationSection;
  const sectionBadge = eduConfig?.badge || 'Academic Foundation';
  const sectionTitle = eduConfig?.title || 'Education & Credentials';
  const sectionDesc =
    eduConfig?.description ||
    'Formal degrees in sociology and social work, foundational academic performance, and institutional credentials.';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 40%'],
  });

  return (
    <section id="education" className="section bg-grid-pattern" aria-label="Academic Education">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <SectionBadge icon={<GraduationCap size={13} strokeWidth={1.75} />}>
            {sectionBadge}
          </SectionBadge>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-description">
            {sectionDesc}
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
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="timeline-item-wrapper">
                <div className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-outer)', width: '100%' }} />
              </div>
            ))
          ) : (
            education.map((edu) => (
              <EducationItem key={edu._id} edu={edu} />
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
          justifyContent: center;
          z-index: 2;
          transition: border-color 0.25s ease;
        }

        .timeline-node-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: background-color 0.25s ease;
        }

        .education-card-header {
          display: flex;
          flex-direction: column-reverse;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
        }

        .education-header-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (min-width: 640px) {
          .education-card-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
          .education-card-header > div:last-child {
            order: 1;
          }
          .education-header-meta {
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
