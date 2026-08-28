'use client';

import { useRef } from 'react';
import { motion, useScroll, useInView } from 'motion/react';
import { GraduationCap, Calendar, Award, Building2 } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Education } from '@/types/portfolio';

interface EducationSectionProps {
  education?: Education[];
  isLoading: boolean;
}

function EducationItem({ edu }: { edu: Education }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { margin: '0px 0px -35% 0px', once: false });
  const isHighlighted = isInView || edu.isCurrent;

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

      {/* Education Card */}
      <div className="bezel-card bezel-card-interactive">
        <div className="bezel-core">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <GraduationCap size={18} strokeWidth={1.75} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.015em' }}>
                {edu.degree}
              </h3>
            </div>

            {edu.isCurrent && (
              <span className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                Currently Enrolled
              </span>
            )}
          </div>

          <p style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.85rem' }}>
            <Building2 size={14} strokeWidth={1.75} />
            <span>{edu.institution}</span>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--fg-muted)', fontWeight: 500 }}>
              <Calendar size={13} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
              <span>{edu.startDate}{edu.isCurrent ? ' – Present' : edu.endDate ? ` – ${edu.endDate}` : ''}</span>
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: 'var(--accent)',
                fontWeight: 600,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
              }}
            >
              <Award size={13} strokeWidth={1.75} />
              <span>{edu.result}</span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export function EducationSection({ education = [], isLoading }: EducationSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
            Academic Foundation
          </SectionBadge>
          <h2 className="section-title">Education & Credentials</h2>
          <p className="section-description">
            Formal degrees in sociology and social work, foundational academic performance, and institutional credentials.
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
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-outer)' }} />
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
