'use client';

import { motion } from 'motion/react';
import { GraduationCap, Calendar, Award, Building2 } from 'lucide-react';
import type { Education } from '@/types/portfolio';

interface EducationSectionProps {
  education?: Education[];
  isLoading: boolean;
}

export function EducationSection({ education = [], isLoading }: EducationSectionProps) {
  return (
    <section id="education" className="section bg-grid-pattern" aria-label="Academic Education">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">
            <GraduationCap size={13} /> Academic Foundation
          </span>
          <h2 className="section-title">Education & Credentials</h2>
          <p className="section-description">
            Formal degrees in sociology and social work, foundational academic performance, and institutional credentials.
          </p>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="timeline-item">
                  <div className="skeleton" style={{ height: '96px' }} />
                </div>
              ))
            : education.map((edu) => (
                <div key={edu._id} className="timeline-item">
                  <div className="bezel-card">
                    <div className="bezel-core">
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <GraduationCap size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          <h3 style={{ fontSize: '1.1rem', color: 'var(--fg)' }}>
                            {edu.degree}
                          </h3>
                        </div>

                        {edu.isCurrent && (
                          <span className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                            Currently Enrolled
                          </span>
                        )}
                      </div>

                      <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fg)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem' }}>
                        <Building2 size={14} style={{ color: 'var(--fg-muted)' }} />
                        {edu.institution}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
                          <Calendar size={13} />
                          {edu.startDate}{edu.isCurrent ? ' – Present' : edu.endDate ? ` – ${edu.endDate}` : ''}
                        </span>
                        <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--accent)', fontWeight: 700 }}>
                          <Award size={13} />
                          {edu.result}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
        </div>

      </div>
    </section>
  );
}
