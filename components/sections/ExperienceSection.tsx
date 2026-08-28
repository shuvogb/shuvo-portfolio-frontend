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
    <div ref={itemRef} style={{ position: 'relative' }}>
      {/* Concentric Double Circle Milestone Node (24px outer, 10px inner) */}
      <div
        style={{
          position: 'absolute',
          left: '-2.75rem',
          top: '24px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg)',
          border: isHighlighted ? '2px solid var(--accent)' : '2px solid var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          transition: 'border-color 0.25s ease',
        }}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: isHighlighted ? 'var(--accent)' : 'var(--border-strong)',
            transition: 'background-color 0.25s ease',
          }}
        />
      </div>

      {/* Experience Card */}
      <div className="bezel-card bezel-card-interactive">
        <div className="bezel-core">
          
          {/* Role Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '0.85rem',
              marginBottom: '1.25rem',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--fg)',
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.015em',
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
                  fontSize: '0.9rem',
                }}
              >
                <Building size={15} strokeWidth={1.75} />
                <span>{exp.organization}</span>
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              {exp.isCurrent && (
                <span className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                  <CheckCircle2 size={11} strokeWidth={2} /> Current Role
                </span>
              )}
              <span
                style={{
                  fontSize: '0.785rem',
                  fontWeight: 500,
                  color: 'var(--fg-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                }}
              >
                <Calendar size={12} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
                <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
              </span>
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
                    gap: '0.75rem',
                    fontSize: '0.885rem',
                    color: 'var(--fg-muted)',
                    lineHeight: 1.65,
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
                  <span style={{ flex: 1, color: 'var(--fg-muted)' }}>{bullet}</span>
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

        {/* Lag-Free Scroll-Follow Timeline */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            paddingLeft: '2.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* Static Background Vertical Track Line */}
          <div
            style={{
              position: 'absolute',
              left: '11px',
              top: '36px',
              bottom: '40px',
              width: '2px',
              backgroundColor: 'var(--border)',
            }}
          />

          {/* Crisp Scroll-Follow Progress Line (No Glow) */}
          <motion.div
            style={{
              position: 'absolute',
              left: '11px',
              top: '36px',
              bottom: '40px',
              width: '2px',
              backgroundColor: 'var(--accent)',
              scaleY: scrollYProgress,
              transformOrigin: 'top',
              willChange: 'transform',
            }}
          />

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div className="skeleton" style={{ height: '150px', borderRadius: 'var(--radius-outer)' }} />
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
        @media (max-width: 640px) {
          div[style*="padding-left: 2.75rem"] {
            padding-left: 2rem !important;
          }
          div[style*="left: 11px"] {
            left: 8px !important;
          }
          div[style*="left: -2.75rem"] {
            left: -2rem !important;
            width: 18px !important;
            height: 18px !important;
          }
          div[style*="left: -2.75rem"] > div {
            width: 8px !important;
            height: 8px !important;
          }
        }
      `}</style>
    </section>
  );
}
